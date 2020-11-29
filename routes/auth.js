var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/register', authController.getRegister);

router.post('/register', authController.postRegister);

router.post('/logout', authController.getLogout);

module.exports = router;
