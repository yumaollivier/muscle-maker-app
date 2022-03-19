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

exports.getProfile = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/profile', {
    path: '/profile',
    pageTitle: 'Mon compte',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getNewProgram = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/newprogram', {
    path: '/newprogram',
    pageTitle: 'Nouveau programme',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getNewExpressWorkout = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/newexpressworkout', {
    path: '/newexpressworkout',
    pageTitle: 'Séance express',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getNewWorkout = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/newworkout', {
    path: '/newworkout',
    pageTitle: 'Nouveau programme',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getNewExercise = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/newexercise', {
    path: '/newexercise',
    pageTitle: 'Ajouter un exercice',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getExercise = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/checkexercise', {
    path: '/exercise',
    pageTitle: 'Nom de l\'exercice',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getPrograms = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/programs', {
    path: '/programs',
    pageTitle: 'Mes programmes',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getTrainings = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/trainings', {
    path: '/trainings',
    pageTitle: 'Mes entrainements',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getProgram = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/program', {
    path: '/program',
    pageTitle: 'Nom du programme',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getTraining = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/training', {
    path: '/training',
    pageTitle: 'Nom de la séance',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getStart = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/start', {
    path: '/start',
    pageTitle: 'Nom du programme',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}

exports.getStartExercise = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/startexercise', {
    path: '/startexercise',
    pageTitle: 'Nom du programme',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
  });
}