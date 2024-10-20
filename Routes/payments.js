
const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const auth = require('../middleware/auth');

router.post('/', auth, paymentController.processPayment);

module.exports = router;