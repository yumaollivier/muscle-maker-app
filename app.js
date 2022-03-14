const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const compression = require('compression');
const flash = require('flash');
const csrf = require('csurf');

const errorController = require('./controllers/error');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.APP_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
  );
  app.use(csrfProtection);
  app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use(adminRoutes);
app.use(authRoutes);

// app.get('/500', errorController.get500);

// app.use(errorController.get404);

// app.use((error, req, res, next) => {
//   res.status(500).render('500', {
//     pageTitle: 'Error !',
//     path: '/500',
//     isAuthenticated: req.session.isLoggedIn,
//   });
// });

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('CONNECTED');
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
