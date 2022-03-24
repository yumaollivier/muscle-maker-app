const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');

const router = express.Router();

router.get('/', isAuth, adminController.getDashboard);

router.get('/profile', isAuth, adminController.getProfile);

router.get('/newprogram/:programId', isAuth, adminController.getNewProgram);

router.get('/newprogram', isAuth, adminController.getNewProgram);

router.post(
  '/newprogram',
  [
    body('programName').trim(),
    body('programDuration').isNumeric(),
    body('numberOfWorkout').isNumeric(),
  ],
  isAuth,
  adminController.postNewProgram
);

router.post(
  '/newprogram/:programId',
  [
    body('programName').trim(),
    body('programDuration').isNumeric(),
    body('numberOfWorkout').isNumeric(),
  ],
  isAuth,
  adminController.postNewProgram
);

router.get('/newexpressworkout', isAuth, adminController.getNewExpressWorkout);

router.get('/newexpressworkout/:trainingId', isAuth, adminController.getNewExpressWorkout);

router.get('/newtraining/:programId', isAuth, adminController.getNewTraining);

router.get(
  '/newtraining/:programId/:trainingId',
  isAuth,
  adminController.getNewTraining
);

router.post(
  '/newtraining/:programId',
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

router.get('/newexercise/:trainingId', isAuth, adminController.getNewExercise);

router.get('/newexercise/:trainingId/:exerciseId', isAuth, adminController.getNewExercise);

router.post(
  '/newexercise/:trainingId',
  [
    body('exerciseName').trim(),
    body('muscleTarget').trim(),
    body('reps').isNumeric(),
    body('rest').isNumeric(),
  ],
  isAuth,
  adminController.postNewExercise
);

router.post(
  '/newexercise/:trainingId/:exerciseId',
  [
    body('exerciseName').trim(),
    body('muscleTarget').trim(),
    body('reps').isNumeric(),
    body('rest').isNumeric(),
  ],
  isAuth,
  adminController.postNewExercise
);

router.get('/exercise/:exerciseId', isAuth, adminController.getExercise);

router.get('/programs', isAuth, adminController.getPrograms);

router.get('/trainings', isAuth, adminController.getTrainings);

router.get('/program/:programId', isAuth, adminController.getProgram);

router.get('/delete/:element/:id', isAuth, adminController.getDelete);

router.get('/training/:trainingId', isAuth, adminController.getTraining);

router.get('/start/:trainingId', isAuth, adminController.getStart);

router.post('/start/:trainingId', isAuth, adminController.postStart);

router.get('/startexercise/:exerciseId', isAuth, adminController.getStartExercise);

router.post('/startexercise/:exerciseId', isAuth, adminController.postStartExercise);

module.exports = router;
