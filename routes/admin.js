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

router.get('/newtraining/:programId/:trainingId', isAuth, adminController.getNewTraining);

router.post(
  '/newtraining',
  [
    body('workoutName').trim(),
    body('muscleTarget').isNumeric(),
    body('numberOfWorkout').isNumeric(),
  ],
  isAuth,
  adminController.postNewProgram
);

router.get('/newexercise/:exerciseId', isAuth, adminController.getNewExercise);

router.post(
  '/newexercise/:exerciseId',
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

router.get('/start', isAuth, adminController.getStart);

router.get('/startexercise', isAuth, adminController.getStartExercise);

module.exports = router;
