const {Basket, BasketDevice} = require('../models/models')
const ApiError = require('../error/ApiError')

class BasketDeviceController {
    async create(req, res, next) {
        try {
            const {userId, deviceId, changeAmount} = req.body
            const basket = await Basket.findOne(
                {
                    where: {userId}
                }
            )
            const basketId = basket.id
            const basketDevice = await BasketDevice.findOrCreate({where: {basketId, deviceId}})
            if ((typeof basketDevice[basketDevice.length - 1]) === "boolean") {
                if (basketDevice[basketDevice.length - 1] === false)
                if (changeAmount && (changeAmount === "decrease")) {
                    if (basketDevice[0].amount > 1) {
                        basketDevice[0].amount -= 1
                        await basketDevice[0].save()
                    }
                } else {
                    basketDevice[0].amount += 1
                    await basketDevice[0].save()
                }
            }

            return res.json(basketDevice)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        const {userId} = req.query
        const basket = await Basket.findOne(
            {
                where: {userId}
            }
        )
        const basketId = basket.id
        const basketDevices = await BasketDevice.findAll(
            {
                where: {basketId}
            }
        )

        return res.json(basketDevices)
    }

    async delete(req, res, next) {
        try {
            const {userId, deviceId} = req.query
            const basket = await Basket.findOne(
                {
                    where: {userId}
                }
            )
            const basketId = basket.id
            if (deviceId !== -1) {
                const basketDevice = await BasketDevice.destroy(
                    {
                        where: {basketId, deviceId}
                    }
                )
            } else {
                const basketDevice = await BasketDevice.findAll(
                    {
                        where: {basketId}
                    }
                )
                await basketDevice.destroy()
                await basketDevice.save()
            }

            return res.json(basketDevice)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const {userId} = req.query
            const basket = await Basket.findOne(
                {
                    where: {userId}
                }
            )
            const basketId = basket.id
            const basketDevices = await BasketDevice.destroy(
                {
                    where: {basketId}
                }
            )

            return res.json(basketDevices)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new BasketDeviceController()