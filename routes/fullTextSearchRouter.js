const Router = require('express')
const fullTextSearchController = require('../controllers/fullTextSearchController')
const router = new Router()

router.get('/', fullTextSearchController.getAll)

module.exports = router