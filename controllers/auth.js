// const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Connexion',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: false,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Inscription',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: false,
  });
};
