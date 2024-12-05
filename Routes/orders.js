
const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);

module.exports = router;