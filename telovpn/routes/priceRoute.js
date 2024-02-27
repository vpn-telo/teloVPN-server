const Router = require('express')
const priceController = require('../controllers/priceController')
const router = new Router()

router.get('/price/:promocode', priceController.getPrice)
router.post('/price', priceController.addPrice)
router.delete('/price/:promocode', priceController.deletePrice)


module.exports = router