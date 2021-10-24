const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError')

class FullTextSearchController {
    async getAll(req, res) {
        let {name} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices = await Device.findAndCountAll({name})

        return res.json(devices)
    }
}

module.exports = new FullTextSearchController()