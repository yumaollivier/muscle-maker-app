// const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Users = require('../models/users');

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

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Connexion',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      isAuth: false,
    });
  }

  Users.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Connexion',
          errorMessage: 'Le mot de passe ou l\'adresse mail n\'est pas correct.',
          validationErrors: [],
          isAuth: false,
        });
      }
      bcrypt.compare(password, user.password).then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Connexion',
          errorMessage: 'Le mot de passe ou l\'adresse mail n\'est pas correct.',
          validationErrors: [],
          isAuth: false,
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
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

exports.postSignup = (req, res, next) => {
  const pseudo = req.body.pseudo;
  const age = req.body.age;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Inscription',
      errorMessage: 'Ton inscription n\'a pas fonctionné. Vérifie tes données et réessaie à nouveau et si l\'erreur persiste n\'hésite pas à me contacter.',
      validationErrors: errors.array(),
      isAuth: false,
    });
  }
  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const User = new Users({
        pseudo: pseudo,
        age: age,
        email: email,
        password: hashedPassword,
      });
      return User.save();
    })
    .then(user => {
      console.log('User created');
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/login');
  });
};

// exports.getReset = (req, res, next) => {
//   let message = req.flash('error');
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render('auth/reset', {
//     path: '/reset',
//     pageTitle: 'Reset',
//     isAuthenticated: false,
//     errorMessage: message,
//   });
// };

// exports.postReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect('/reset');
//     }
//     const token = buffer.toString('hex');
//     User.findOne({ email: req.body.email })
//       .then(user => {
//         if (!user) {
//           req.flash('error', 'No account with that email found.');
//           res.redirect('/reset');
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         return user.save();
//       })
//       .then(result => {
//         res.redirect('/');
//         transporter
//           .sendMail({
//             to: req.body.email,
//             from: '*',
//             subject: 'Reset Password',
//             html: `
//               <p>You requested a password reset</p>
//               <p>Click this <a href="localhost:3000/reset/${token}">link</a> to set a new password</p>
//             `,
//           })
//           .catch(err => console.log(err));
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(err);
//       });
//   });
// };

// exports.getNewPassword = (req, res, next) => {
//   const token = req.params.token;
//   User.findOne({
//     resetToken: token,
//     resetTokenExpiration: { $gt: Date.now() },
//   })
//     .then(user => {
//       let message = req.flash('error');
//       if (message.length > 0) {
//         message = message[0];
//       } else {
//         message = null;
//       }
//       res.render('auth/new-password', {
//         path: '/new-password',
//         pageTitle: 'New password',
//         errorMessage: message,
//         userId: user._id.toString(),
//         passwordToken: token,
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(err);
//     });
// };

// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;
//   User.findOne({
//     resetToken: passwordToken,
//     resetTokenExpiration: { $gt: Date.now() },
//     _id: userId,
//   })
//     .then(user => {
//       resetUser = user;
//       return bcrypt.hash(newPassword, 32);
//     })
//     .then(hashedPassword => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = null;
//       resetUser.resetTokenExpiration = null;
//       return user.save();
//     })
//     .then(result => {
//       res.redirect('/login');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(err);
//     });
// };
