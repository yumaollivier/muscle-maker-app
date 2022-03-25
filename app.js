const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const flash = require('connect-flash');
const csrf = require('csurf');
const SessionStore = require('express-session-sequelize')(session.Store);

const postgresDb = require('./database/database');

const Users = require('./models/users');
const Trainings = require('./models/trainings');
const Programs = require('./models/programs');
const Exercises = require('./models/exercises');

const errorController = require('./controllers/error');

const sequelizeSessionStore = new SessionStore({
  db: postgresDb,
});

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

Users.hasMany(Programs);
Users.hasMany(Exercises);
Users.hasMany(Trainings);
Programs.hasMany(Trainings);
Trainings.hasMany(Exercises);
Trainings.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' });
Exercises.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' });
Programs.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' });

console.log('Sync DB');
postgresDb
  .sync()
  .then(() => {
    app.use(express.static(path.join(__dirname, 'public')));
    console.log('DB Synced');
    app.use(
      session({
        secret: process.env.APP_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: sequelizeSessionStore,
        // cookie: app.get('env') === 'production' ? {secure: true} : {} //works only with https
      })
    );

    app.use((req, res, next) => {
      const token = req.csrfToken();
      res.locals.connected = req.session.isLoggedIn;
      res.cookie('XSRF-TOKEN', token);
      res.locals.csrfToken = token;
      next();
    });

    app.use(flash());

    app.use((req, res, next) => {
      if (!req.session.user) {
        return next();
      }
      Users.findByPk(req.session.user.id)
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

    app.get('/500', errorController.get500);

    app.use(errorController.get404);
    app.use((error, req, res, next) => {
      console.error(error);
      res.status(500).render('500', {
        pageTitle: 'Erreur !',
        path: '/500',
        connected: req.session.isLoggedIn,
        user: req.user,
      });
    });

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server has started on port ${port}`);
    });
  })
  .catch(err => console.log('could not sync DB:', err));
