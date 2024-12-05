const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/delete',authController.deleteAllUser);
module.exports = router;