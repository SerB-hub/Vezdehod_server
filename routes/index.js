const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const basketDeviceRouter = require('./basketDeviceRouter')
const orderRouter = require('./orderRouter')
const fullTextSearchRouter = require('./fullTextSearchRouter')


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/basketDevice', basketDeviceRouter)
router.use('/order', orderRouter)
router.use('/search', fullTextSearchRouter)


module.exports = router