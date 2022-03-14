const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getDashboard = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/dashboard', {
    path: '/dashboard',
    pageTitle: 'Dashboard',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}