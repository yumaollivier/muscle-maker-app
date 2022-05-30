const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');

const router = express.Router();

router.get('/', isAuth, adminController.getDashboard);

router.get('/profile', isAuth, adminController.getProfile);

router.get(
  ['/newprogram', '/newprogram/:programId'],
  isAuth,
  adminController.getNewProgram
);

router.post(
  ['/newprogram', '/newprogram/:programId'],
  [
    body('programName').trim(),
    body('programDuration').isNumeric(),
    body('numberOfWorkout').isNumeric(),
  ],
  isAuth,
  adminController.postNewProgram
);

router.get(
  ['/newexpresstraining', '/newexpresstraining/:trainingId'],
  isAuth,
  adminController.getNewExpressTraining
);

router.get(
  ['/newtraining/:programId', '/newtraining/:programId/:trainingId'],
  isAuth,
  adminController.getNewTraining
);

router.post(
  [
    '/newtraining',
    '/newtraining/:programId',
    '/newexpresstraining',
    '/newexpresstraining/:trainingId',
  ],
  [
    body('workoutName').trim(),
    body('muscleTarget').isNumeric(),
    body('numberOfWorkout').isNumeric(),
  ],
  isAuth,
  adminController.postNewTraining
);

router.post(
  '/newtraining/:programId/:trainingId',
  [
    body('workoutName').trim(),
    body('muscleTarget').isNumeric(),
    body('numberOfWorkout').isNumeric(),
  ],
  isAuth,
  adminController.postNewTraining
);

router.get(
  ['/newexercise/:trainingId', '/newexercise/:trainingId/:exerciseId'],
  isAuth,
  adminController.getNewExercise
);

router.post(
  ['/newexercise/:trainingId', '/newexercise/:trainingId/:exerciseId'],
  [
    body('exerciseName').trim(),
    body('muscleTarget').trim(),
    body('reps').isNumeric(),
    body('rest').isNumeric(),
  ],
  isAuth,
  adminController.postNewExercise
);

router.get(
  '/newexercise/:trainingId/circuit/:firstExerciseId',
  
  isAuth,
  adminController.getNewCircuit
);

router.post(
  '/newexercise/:trainingId/circuit/:firstExerciseId',[
    body('exerciseName').trim(),
    body('muscleTarget').trim(),
    body('reps').isNumeric(),
    body('rest').isNumeric(),
  ],
  isAuth,
  adminController.postNewCircuit
);

router.get('/exercise/:exerciseId', isAuth, adminController.getExercise);

router.get(
  '/exercisestat/:exerciseId',
  isAuth,
  adminController.getExerciseStat
);

router.get('/programs', isAuth, adminController.getPrograms);

router.get('/trainings', isAuth, adminController.getTrainings);

router.get('/program/:programId', isAuth, adminController.getProgram);

router.get('/delete/:element/:id', isAuth, adminController.getDelete);

router.get('/training/:trainingId', isAuth, adminController.getTraining);

router.get('/start/:trainingId', isAuth, adminController.getStart);

router.post('/start/:trainingId', isAuth, adminController.postStart);

router.get(
  '/startexercise/:exerciseId',
  isAuth,
  adminController.getStartExercise
);

router.post(
  '/startexercise/:exerciseId',
  isAuth,
  adminController.postStartExercise
);

router.get('/statistic', isAuth, adminController.getStats);

router.get('/statisticgroup/:muscleTarget', isAuth, adminController.getStats);

module.exports = router;
