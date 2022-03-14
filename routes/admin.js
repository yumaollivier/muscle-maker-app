const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');

const router = express.Router();

router.get('/', adminController.getDashboard);

module.exports = router;