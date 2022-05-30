const Users = require('../models/users');

exports.get404 = (req, res, next) => {
  if (req.session.user) {
    Users.findOne({ where: { id: req.session.user.id } }).then(user => {
      res.status(404).render('404', {
        pageTitle: 'Page introuvable',
        path: '',
        isAuth: req.session.isLoggedIn,
      });
    });
  }
};

exports.get500 = (req, res, next) => {
  if (req.session.user) {
    Users.findOne({ where: { id: req.session.user.id } }).then(user => {
      res.status(500).render('500', {
        pageTitle: 'Erreur !',
        path: '/500',
        isAuth: req.session.isLoggedIn,
      });
    });
  }
};
