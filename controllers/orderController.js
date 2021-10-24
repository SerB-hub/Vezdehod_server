const {Order, OrderDevice} = require('../models/models')
const ApiError = require('../error/ApiError')

class OrderController {
    async create(req, res, next) {
        try {
            const {userId, totalPrice, placeOfIssue, paymentMethod, status, amount} = req.body
            const order = await Order.create(
                {
                    userId, totalPrice, placeOfIssue, paymentMethod, status
                }
            )
            const orderId = order.id
            let amountDict = JSON.parse(amount)

            let orderAndDevices = [order]

            for (let [key, value] of Object.entries(amountDict)) {
                let orderDevice = await OrderDevice.create({orderId, deviceId: key, amount: value})
                orderAndDevices.push(orderDevice)
            }

            return res.json(orderAndDevices)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }   
    }

    async getAll(req, res) {
        const {userId} = req.query
        const orders = await Order.findAll(
            {
                where: {userId},
                include: [{model: OrderDevice, as: 'devices'}]
            }
        )
        /*
        for (let order of orders) {
            let orderId = order.id
            let orderDevices = await OrderDevice.findAll(
                {
                    where: {orderId},
                }
            )
        }
        */
        return res.json(orders)
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
            const basketDevice = await BasketDevice.destroy(
                {
                    where: {basketId, deviceId}
                }
            )

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

module.exports = new OrderController()