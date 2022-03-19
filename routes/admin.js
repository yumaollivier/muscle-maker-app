const express = require('express');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const { check, body } = require('express-validator');

const router = express.Router();

router.get('/', adminController.getDashboard);

router.get('/profile', adminController.getProfile);

router.get('/newprogram', adminController.getNewProgram);

router.get('/newexpressworkout', adminController.getNewExpressWorkout);

router.get('/newworkout', adminController.getNewWorkout);

router.get('/newexercise', adminController.getNewExercise);

router.get('/exercise', adminController.getExercise);

router.get('/programs', adminController.getPrograms);

router.get('/trainings', adminController.getTrainings);

router.get('/program', adminController.getProgram);

router.get('/training', adminController.getTraining);

router.get('/start', adminController.getStart);

router.get('/startexercise', adminController.getStartExercise);

module.exports = router;
