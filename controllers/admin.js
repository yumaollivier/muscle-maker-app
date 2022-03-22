const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Users = require('../models/users');
const Programs = require('../models/programs');
const Trainings = require('../models/trainings');
const Exercises = require('../models/exercises');

const allEqual = arr => arr.every(v => v === arr[0]);

const getExerciseData = (exercise, minimize = true) => {
  const schema = exercise.schema.split('-');
  if (minimize) {
    const set = [];
    const reps = [];
    const rest = [];
    schema.forEach(el => {
      const schemaArray = el.split(',');
      set.push(schemaArray[0]);
      reps.push(schemaArray[1]);
      rest.push(schemaArray[2]);
    });
    const exerciseData = {
      id: exercise.id,
      name: exercise.name,
      set: Math.max(...set),
      reps: allEqual(reps) ? reps[0] : reps.join(', '),
      rest: allEqual(rest) ? rest[0] : rest.join(', '),
      notes: exercise.notes,
    };
    return exerciseData;
  } else {
    const schemaData = [];
    schema.forEach(el => {
      const schemaArray = el.split(',');
      const dataObject = {};
      dataObject.set = schemaArray[0];
      dataObject.reps = schemaArray[1];
      dataObject.rest = schemaArray[2];
      schemaData.push(dataObject);
    });
    const exerciseData = {
      id: exercise.id,
      name: exercise.name,
      schema: schemaData,
      notes: exercise.notes,
    };
    return exerciseData;
  }
};

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
};

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
};

exports.getNewProgram = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const programId = req.params.programId;
  const trainings = [];
  if (programId !== undefined) {
    Programs.findByPk(programId).then(program => {
      Trainings.findAll({where: {UserId: req.user.id, ProgramId: programId}}).then(trainings => {
        console.log(trainings)
        res.render('admin/newprogram', {
          path: `/newprogram/${programId}`,
          pageTitle: `${program.name}`,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          program: program,
          trainings
        });
      })
    });
  } else {
    req.user.createProgram({}).then(program => {
      console.log('New program created');
      res.render('admin/newprogram', {
        path: '/newprogram',
        pageTitle: 'Nouveau programme',
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        program: program,
        trainings
      });
    });
  }
};

exports.postNewProgram = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const name = req.body.programName;
  const duration = req.body.programDuration;
  const trainingNumber = req.body.numberOfWorkout;
  const trainingIds = req.body.trainingIds;
  Programs.findOne({
    where: { UserId: req.user.id, id: req.body.programId },
  })
    .then(program => {
      program.name = name;
      program.duration = duration;
      program.trainingNumber = trainingNumber;
      program.trainingsIds = trainingIds;
      return program.save().then(result => {
        console.log('New program created');
        res.redirect('/programs');
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

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
};

exports.getNewTraining = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const trainingId = req.params.trainingId;
  const programId = req.params.programId;
  if (trainingId !== undefined) {
    Trainings.findOne({
      where: { UserId: req.user.id, ProgramId: programId, id: trainingId },
    }).then(training => {
      const exerciseIds = training.exerciseIds.split(',');
      const exercises = [];
      exerciseIds.forEach(exerciseId => {
        Exercises.findOne({
          where: { UserId: req.user.id, id: exerciseId },
        }).then(exercise => {
          const exerciseData = getExerciseData(exercise);
          exercises.push(exerciseData);
        });
      });
      res.render('admin/newtraining', {
        path: `/newtraining/${trainingId}`,
        pageTitle: `${training.name}`,
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        training,
        exercises,
      });
    });
  } else {
    Programs.findOne({ where: { UserId: req.user.id, id: programId } }).then(
      program => {
        program
          .createTraining({
            UserId: req.user.id,
          })
          .then(training => {
            console.log('New training created');
            res.render('admin/newtraining', {
              path: '/newtraining',
              pageTitle: 'Nouvelle séance',
              errorMessage: message,
              validationErrors: [],
              isAuth: true,
              training,
            });
          });
      }
    );
  }
};

exports.postNewTraining = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const name = req.body.workoutName;
  const muscleTarget = req.body.muscleTarget;
  const exercises = req.body.exercisesIds;
  Trainings.findOne({
    where: { UserId: req.user.id, id: req.body.trainingId },
  })
    .then(training => {
      training.name = name;
      training.muscleTarget = muscleTarget;
      training.exerciseIds = exercises;
      res.redirect('/programs');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getNewExercise = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const exerciseId = req.params.exerciseId;
  const trainingId = req.params.trainingId;
  if (exerciseId !== undefined) {
    Exercises.findOne({ where: { UserId: req.user.id, id: exerciseId } }).then(
      exercise => {
        Trainings.findOne({
          where: { UserId: req.user.id, id: trainingId },
        }).then(training => {
          const exerciseData = getExerciseData(exercise, false);
          res.render('admin/newexercise', {
            path: `/newexercise/${exerciseId}`,
            pageTitle: 'Modifier un exercice',
            user: false,
            errorMessage: message,
            validationErrors: [],
            isAuth: true,
            exercise: exerciseData,
            trainingId: training.ProgramId,
          });
        });
      }
    );
  } else {
    Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } }).then(
      training => {
        training.createExercise({ UserId: req.user.id }).then(exercise => {
          res.render('admin/newexercise', {
            path: '/newexercise',
            pageTitle: 'Ajouter un exercice',
            user: false,
            errorMessage: message,
            validationErrors: [],
            isAuth: true,
            exercise,
            programId: training.ProgramId,
          });
        });
      }
    );
  }
};

exports.postNewExercise = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const exerciseId = req.body.exerciseId;
  const programId = req.body.programId;
  const name = req.body.exerciseName;
  const muscleTarget = req.body.muscleTarget;
  const setSchema = req.body.exerciseSchema;
  const notes = req.body.trainingNotes;
  Exercises.findOne({ where: { UserId: req.user.id, id: exerciseId } })
    .then(exercise => {
      exercise.name = name;
      exercise.muscleTarget = muscleTarget;
      exercise.schema = setSchema;
      exercise.notes = notes;
    })
    .then(result => {
      res.redirect(`/programs/${programId}`);
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getExercise = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const exerciseId = req.params.exerciseId;
  Exercises.findOne({ where: { UserId: req.user.id, id: exerciseId } }).then(
    exercise => {
      const exerciseData = getExerciseData(exercise, false);
      res.render('admin/exercise', {
        path: '/exercise',
        pageTitle: exercise.name,
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        exercise: exerciseData,
        trainingId: exercise.TrainingId,
      });
    }
  );
};

exports.getPrograms = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  Programs.findAll({ where: { UserId: req.user.id } }).then(programs => {
    res.render('admin/programs', {
      path: '/programs',
      pageTitle: 'Mes programmes',
      user: false,
      errorMessage: message,
      validationErrors: [],
      isAuth: true,
      programs,
    });
  });
};

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
};

exports.getProgram = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const programId = req.params.programId;
  Programs.findOne({
    where: { UserId: req.user.id, id: programId },
  }).then(program => {
    console.log(program);
    const trainingIds = program.trainingsIds.split(',');
    const trainings = [];
    trainingIds.forEach(trainingId => {
      Trainings.findOne({
        where: { UserId: req.user.id, id: trainingId },
      }).then(training => {
        trainings.push(training);
      });
    });
    res.render('admin/program', {
      path: '/program',
      pageTitle: `${program.name}`,
      user: false,
      errorMessage: message,
      validationErrors: [],
      isAuth: true,
      program,
      trainings,
    });
  });
};

exports.getTraining = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const trainingId = req.params.trainingId;
  Trainings.findOne({
    where: { UserId: req.user.id, id: trainingId },
  }).then(training => {
    const exerciseIds = training.exerciseIds.split(',');
    const exercises = [];
    exerciseIds.forEach(exerciseId => {
      Exercises.findOne({
        where: { UserId: req.user.id, id: exerciseId },
      }).then(exercise => {
        const exerciseData = getExerciseData(exercise);
        exercises.push(exerciseData);
      });
    });
    res.render('admin/program', {
      path: '/program',
      pageTitle: `${training.name}`,
      user: false,
      errorMessage: message,
      validationErrors: [],
      isAuth: true,
      exercises,
    });
  });
};

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
};

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
};

exports.getDelete = (req, res, next) => {
  const userId = req.user.id;
  const elementId = req.params.id;
  const elementToDelete = req.params.element;
  switch (elementToDelete) {
    case 'program':
      Programs.destroy({ where: { UserId: userId, id: elementId } }).then(
        result => {
          res.redirect('/programs');
        }
      );
      break;
    case 'exercise':
      Exercises.destroy({ where: { UserId: userId, id: elementId } }).then(exercise => {
        res.redirect(`/newtraining/${exercise.TrainingId}`);
      });
      break;
    case 'training':
      Trainings.destroy({ where: { UserId: userId, id: elementId } }).then(training => {
        res.redirect(`/newprogram/${training.ProgramId}`);
      });
      break;
    case 'user':
      Users.destroy({ where: { UserId: userId, id: elementId } }).then(
        result => {
          Programs.destroy({ where: { UserId: userId } });
          Exercises.destroy({ where: { UserId: userId } });
          Trainings.destroy({ where: { UserId: userId } });
          req.session.destroy(err => {
            console.log(err);
            res.redirect('/signup');
          });
        }
      );
      break;
  }
};
