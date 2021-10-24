const Router = require('express')
const orderController = require('../controllers/orderController')
const router = new Router()

router.post('/', orderController.create)
router.get('/', orderController.getAll)
router.delete('/', orderController.delete)
//router.delete('/:id', orderController.delete)

module.exports = router