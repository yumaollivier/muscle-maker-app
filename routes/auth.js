const express = require('express');

const authController = require('../controllers/auth');
const { check, body } = require('express-validator');
const Users = require('../models/users');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Entrez une adresse courriel valide.')
      .normalizeEmail({ gmail_remove_dots: false }),
    body('password', 'Le mot de passe n\'est pas valide.')
      .isLength({ min: 5 })
      .trim(),
  ],
  authController.postLogin
);

router.get('/signup', authController.getSignup);

router.post(
  '/signup',
  [
    body('pseudo').trim(),
    body('age').isNumeric(),
    check('email')
      .isEmail()
      .withMessage('Entrez une adresse courriel valide.')
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      'password',
      'Veuillez entrer un mot de passe contenant minimum 5 caractères.'
    )
      .isLength({ min: 5 })
      .trim(),
  ],
  authController.postSignup
);

// router.post('/logout', authController.postLogout);

// router.get('/reset', authController.getReset);

// router.post(
//   '/reset',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Entrez une adresse courriel valide.')
//       .normalizeEmail({ gmail_remove_dots: false }),
//   ],
//   authController.postReset
// );

// router.get('/reset/:token', authController.getNewPassword);

// router.post('/new-password', authController.postNewPassword);

module.exports = router;
