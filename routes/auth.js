const express = require('express');

const authController = require('../controllers/auth');
const { check, body } = require('express-validator');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

module.exports = router;