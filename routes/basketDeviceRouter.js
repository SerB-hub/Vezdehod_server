const Router = require('express')
const basketDeviceController = require('../controllers/basketDeviceController')
const router = new Router()

router.post('/', basketDeviceController.create)
router.get('/', basketDeviceController.getAll)
router.delete('/', basketDeviceController.delete)
//router.delete('/:id', basketDeviceController.delete)

module.exports = router