const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Sequelize } = require('../db')
const { Op } = require("sequelize");
const sequelize = require("sequelize")

class DeviceController {
    async create(req, res, next) {
        try {
            const {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const device = await Device.create({name, price, brandId, typeId, img: fileName})

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    }))
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page, basketDeviceId, searchField} = req.query
        basketDeviceId = basketDeviceId || null
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && ! typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where: {brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where: {typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where: {brandId, typeId}, limit, offset})
        }
        if (searchField && !brandId && !typeId) {
            let lookupValue = searchField.toLowerCase();
            devices = await Device.findAndCountAll({where: 
                {
                    //name: {
                    //    [Op.like]: `%${searchField}%`
                    //}
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%'),
                 }, limit, offset})
        }
        if (searchField && brandId && !typeId) {
            let lookupValue = searchField.toLowerCase();
            devices = await Device.findAndCountAll({where: 
                {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%'),
                    brandId: brandId
                 }, limit, offset})
        }
        if (searchField && !brandId && typeId) {
            let lookupValue = searchField.toLowerCase();
            devices = await Device.findAndCountAll({where: 
                {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%'),
                    typeId: typeId
                 }, limit, offset})
        }
        if (searchField && brandId && typeId) {
            let lookupValue = searchField.toLowerCase();
            devices = await Device.findAndCountAll({where: 
                {
                    name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + lookupValue + '%'),
                    brandId: brandId,
                    typeId: typeId
                 }, limit, offset})
        }
        if (basketDeviceId && !brandId && ! typeId) {
            if (Number(basketDeviceId) !== -1){
                const array = basketDeviceId.split('-')
                
                for (let item of array) {
                    item = Number(item)
                }

                devices = await Device.findAndCountAll({where: {id: array}, limit, offset})
            } else {
                devices = await Device.findAndCountAll({where: {id: basketDeviceId}, limit, offset})
            }
            
        }
        return res.json(devices)
    }

    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            }
        )
        return res.json(device)
    }
}

module.exports = new DeviceController()