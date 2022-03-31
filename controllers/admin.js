const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Users = require('../models/users');
const Programs = require('../models/programs');
const Trainings = require('../models/trainings');
const Exercises = require('../models/exercises');

const getErrors = req => {
  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  return error;
};

const sortArray = array => {
  return array.sort((a, b) => {
    return a.createdAt - b.createdAt;
  });
};

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
      muscleTarget: exercise.muscleTarget,
      set: Math.max(...set),
      reps: allEqual(reps) ? reps[0] : reps.join(', '),
      rest: allEqual(rest) ? rest[0] : rest.join(', '),
      notes: exercise.notes,
      TrainingId: exercise.TrainingId,
      finished: exercise.finished,
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
      muscleTarget: exercise.muscleTarget,
      set: Math.max(...set),
      reps: allEqual(reps) ? reps[0] : reps.join(', '),
      rest: allEqual(rest) ? rest[0] : rest.join(', '),
      schema: schemaData,
      notes: exercise.notes,
      TrainingId: exercise.TrainingId,
      finished: exercise.finished,
    };
    return exerciseData;
  }
};

exports.getDashboard = (req, res, next) => {
  let message = getErrors(req);
  const userId = req.user.id;
  Programs.findAll({ where: { UserId: userId } }).then(programs => {
    let allPrograms = [];
    if (programs.length > 0) {
      allPrograms = programs;
    }
    res.render('admin/dashboard', {
      path: '/dashboard',
      pageTitle: 'Dashboard',
      user: false,
      errorMessage: message,
      validationErrors: [],
      isAuth: true,
      programs: allPrograms,
    });
  });
};

exports.getProfile = (req, res, next) => {
  let message = getErrors(req);
  res.render('admin/profile', {
    path: '/profile',
    pageTitle: 'Mon compte',
    user: false,
    errorMessage: message,
    validationErrors: [],
    isAuth: true,
    user: req.user,
  });
};

exports.getNewProgram = (req, res, next) => {
  let message = getErrors(req);
  const programId = req.params.programId;
  const trainings = [];
  if (programId !== undefined) {
    Programs.findByPk(programId).then(program => {
      Trainings.findAll({
        where: { UserId: req.user.id, ProgramId: programId },
      }).then(trainings => {
        trainings = sortArray(trainings);
        res.render('admin/newprogram', {
          path: `/newprogram/${programId}`,
          pageTitle: `${program.name}`,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          program,
          trainings,
        });
      });
    });
  } else {
    req.user.createProgram({ name: 'Sans nom' }).then(program => {
      console.log('New program created');
      res.render('admin/newprogram', {
        path: '/newprogram',
        pageTitle: 'Nouveau programme',
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        program,
        trainings,
      });
    });
  }
};

exports.postNewProgram = (req, res, next) => {
  let message = getErrors(req);
  const inputValue = req.body.submitAction;
  const name = req.body.programName;
  const duration = Number(req.body.programDuration);
  const trainingNumber = Number(req.body.numberOfWorkout);
  const trainingIds = req.body.trainingIds;
  Programs.findOne({
    where: { UserId: req.user.id, id: req.body.programId },
  })
    .then(program => {
      program.name = name;
      program.duration = duration;
      program.trainingNumber = trainingNumber;
      program.trainingsIds = trainingIds;
      return program.save().then(program => {
        if (inputValue === 'Enregistrer') {
          res.redirect('/programs');
        } else {
          res.redirect(`/newtraining/${program.id}`);
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getNewTraining = (req, res, next) => {
  let message = getErrors(req);
  const trainingId = req.params.trainingId;
  const programId = req.params.programId;
  const exercises = [];
  if (trainingId !== undefined) {
    Trainings.findOne({
      where: { UserId: req.user.id, ProgramId: programId, id: trainingId },
    }).then(training => {
      if (training.exerciseIds.length > 0) {
        Exercises.findAll({
          where: { UserId: req.user.id, TrainingId: training.id },
        }).then(trainingExercises => {
          trainingExercises = sortArray(trainingExercises);
          trainingExercises.forEach(exercise => {
            const exerciseData = getExerciseData(exercise);
            exercises.push(exerciseData);
          });
          res.render('admin/newtraining', {
            path: `/newtraining`,
            prevPath: undefined,
            pageTitle: `${training.name}`,
            errorMessage: message,
            validationErrors: [],
            isAuth: true,
            training,
            exercises,
          });
        });
      } else {
        res.render('admin/newtraining', {
          path: `/newtraining`,
          prevPath: undefined,
          pageTitle: `${training.name}`,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          training,
          exercises,
        });
      }
    });
  } else {
    Programs.findOne({ where: { UserId: req.user.id, id: programId } }).then(
      program => {
        program
          .createTraining({
            ProgramId: programId,
            UserId: req.user.id,
          })
          .then(training => {
            console.log('New training created');
            res.render('admin/newtraining', {
              path: '/newtraining',
              prevPath: undefined,
              pageTitle: 'Nouvelle séance',
              errorMessage: message,
              validationErrors: [],
              isAuth: true,
              training,
              exercises,
            });
          });
      }
    );
  }
};

exports.postNewTraining = (req, res, next) => {
  let message = getErrors(req);
  const inputValue = req.body.submitAction;
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
      return training.save().then(training => {
        if (inputValue === 'Enregistrer') {
          res.redirect(`/newprogram/${training.ProgramId}`);
        } else if (inputValue === 'Commencer') {
          res.redirect(`/start/${training.id}`);
        } else {
          res.redirect(`/newexercise/${training.id}`);
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getNewExpressTraining = (req, res, next) => {
  let message = getErrors(req);
  const trainingId = req.params.trainingId;
  const exercises = [];
  if (trainingId !== undefined) {
    Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } })
      .then(training => {
        Exercises.findAll({
          where: { UserId: req.user.id, TrainingId: training.id },
        }).then(trainingExercises => {
          trainingExercises = sortArray(trainingExercises);
          trainingExercises.forEach(exercise => {
            const exerciseData = getExerciseData(exercise);
            exercises.push(exerciseData);
          });
          res.render('admin/newtraining', {
            path: `/newexpresstraining`,
            pageTitle: `${training.name}`,
            errorMessage: message,
            validationErrors: [],
            isAuth: true,
            training,
            exercises,
          });
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
      });
  } else {
    req.user
      .createTraining({ UserId: req.user.id })
      .then(training => {
        console.log('New Training created')
        res.render('admin/newtraining', {
          path: `/newexpresstraining`,
          pageTitle: `Séance express`,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          training,
          exercises,
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
      });
  }
};
exports.getNewExercise = (req, res, next) => {
  let message = getErrors(req);
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
            programId: training.ProgramId,
          });
        });
      }
    );
  } else {
    Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } }).then(
      training => {
        training.createExercise({ UserId: req.user.id }).then(exercise => {
          console.log('New Exercise Created');
          res.render('admin/newexercise', {
            path: `/newexercise/${exercise.id}`,
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
  let message = getErrors(req);
  const exerciseId = req.body.exerciseId;
  const programId = req.body.programId;
  const name = req.body.exerciseName;
  const muscleTarget = req.body.muscleTarget;
  const setSchema = req.body.exerciseSchema;
  const notes = req.body.trainingNotes;
  Exercises.findOne({ where: { UserId: req.user.id, id: exerciseId } }).then(
    exercise => {
      exercise.name = name;
      exercise.muscleTarget = muscleTarget;
      exercise.schema = setSchema;
      exercise.notes = notes;
      return exercise
        .save()
        .then(exercise => {
          Trainings.findOne({
            where: { UserId: req.user.id, id: exercise.TrainingId },
          }).then(training => {
            training.exerciseIds += `${exercise.id},`;
            return training.save().then(training => {
              if(training.ProgramId){
                res.redirect(
                  `/newtraining/${training.ProgramId}/${exercise.TrainingId}`
                );
              } else {
                res.redirect(
                  `/newexpresstraining/${exercise.TrainingId}`
                );
              }
            });
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(err);
        });
    }
  );
};

exports.getExercise = (req, res, next) => {
  let message = getErrors(req);
  const exerciseId = req.params.exerciseId;
  Exercises.findOne({ where: { UserId: req.user.id, id: exerciseId } })
    .then(exercise => {
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
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getPrograms = (req, res, next) => {
  let message = getErrors(req);
  Programs.findAll({ where: { UserId: req.user.id } })
    .then(programs => {
      res.render('admin/programs', {
        path: '/programs',
        pageTitle: 'Mes programmes',
        user: false,
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        programs,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getTrainings = (req, res, next) => {
  let message = getErrors(req);
  Trainings.findAll({ where: { UserId: req.user.id } })
    .then(trainings => {
      trainings = sortArray(trainings);
      const trainingArr = [];
      trainings.forEach(training => {
        trainingArr.push(training);
      });
      Programs.findAll({
        where: { UserId: req.user.id },
      }).then(programs => {
        if (programs) {
          trainings.forEach(training => {
            let programName = `Séance express ${training.name}`;
            programs.forEach(program => {
              if (training.ProgramId === program.id) {
                programName = `Programme ${program.name}`;
              } 
            });
            training.programName = programName;
          });
        }
        res.render('admin/trainings', {
          path: '/trainings',
          pageTitle: 'Mes entrainements',
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          trainings: trainingArr,
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getProgram = (req, res, next) => {
  let message = getErrors(req);
  const programId = req.params.programId;
  Programs.findOne({
    where: { UserId: req.user.id, id: programId },
  })
    .then(program => {
      const trainings = [];
      Trainings.findAll({
        where: { UserId: req.user.id, ProgramId: program.id },
      }).then(programTrainings => {
        programTrainings = sortArray(programTrainings)
        if (programTrainings.length > 0) {
          programTrainings.forEach(training => {
            trainings.push(training);
          });
        }
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
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getTraining = (req, res, next) => {
  let message = getErrors(req);
  const trainingId = req.params.trainingId;
  Trainings.findOne({
    where: { UserId: req.user.id, id: trainingId },
  })
    .then(training => {
      const exercises = [];
      Exercises.findAll({
        where: { UserId: req.user.id, TrainingId: training.id },
      }).then(trainingExercises => {
        trainingExercises = sortArray(trainingExercises);
        if (trainingExercises.length > 0) {
          trainingExercises.forEach(exercise => {
            const exerciseData = getExerciseData(exercise);
            exercises.push(exerciseData);
          });
        }
        res.render('admin/training', {
          path: '/training/',
          pageTitle: `${training.name}`,
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          exercises,
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getStart = (req, res, next) => {
  let message = getErrors(req);
  const trainingId = req.params.trainingId;
  Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } })
    .then(training => {
      training.finished = false;
      return training.save().then(training => {
        const exercises = [];
        Exercises.findAll({
          where: { UserId: req.user.id, TrainingId: training.id },
        }).then(trainingExercises => {
          if (trainingExercises.length > 0) {
            trainingExercises = sortArray(trainingExercises);
            trainingExercises.forEach(exercise => {
              const exerciseData = getExerciseData(exercise);
              exercises.push(exerciseData);
            });
          }
          if(training.ProgramId){
            Programs.findByPk(training.ProgramId).then(program => {
              res.render('admin/start', {
                path: `/start/${training.id}`,
                pageTitle: program.name,
                user: false,
                errorMessage: message,
                validationErrors: [],
                isAuth: true,
                training,
                exercises,
              });
            });
          } else {
            res.render('admin/start', {
              path: `/start/${training.id}`,
              pageTitle: training.name,
              user: false,
              errorMessage: message,
              validationErrors: [],
              isAuth: true,
              training,
              exercises,
            });
          }
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postStart = (req, res, next) => {
  let message = getErrors(req);
  const trainingId = req.params.trainingId;
  Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } })
    .then(training => {
      training.finished = true;
      return training.save().then(training => {
        if(training.ProgramId){
          res.redirect(`/program/${training.ProgramId}`);
        } else {
          res.redirect(`/trainings`);
        }
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.getStartExercise = (req, res, next) => {
  let message = getErrors(req);
  const exerciseId = req.params.exerciseId;
  const userId = req.user.id;
  Exercises.findOne({ where: { UserId: userId, id: exerciseId } })
    .then(exercise => {
      const exerciseData = getExerciseData(exercise, false);
      res.render('admin/startexercise', {
        path: `/startexercise/${exercise.id}`,
        pageTitle: 'Entrainement',
        user: false,
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        exercise: exerciseData,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postStartExercise = (req, res, next) => {
  let message = getErrors(req);
  const exerciseId = req.params.exerciseId;
  const userId = req.user.id;
  const exercisePerformance = req.body.exercisePerf;
  Exercises.findOne({ where: { UserId: userId, id: exerciseId } })
    .then(trainingExercise => {
      trainingExercise.finished = true;
      trainingExercise.performances += exercisePerformance;
      return trainingExercise.save().then(exercise => {
        Exercises.findAll({ where: { TrainingId: exercise.TrainingId } }).then(
          exercises => {
            let exerciseIndex;
            exercises = sortArray(exercises);
            for (let i = 0; i < exercises.length; i++) {
              if (exercises[i].id === exercise.id) {
                exerciseIndex = i;
              }
            }
            const nextExerciseIndex = exerciseIndex + 1;
            if (
              exerciseIndex + 1 <= exercises.length - 1 &&
              exerciseIndex !== undefined
            ) {
              const nextExerciseId = exercises[nextExerciseIndex].id;
              res.redirect(`/startexercise/${nextExerciseId}`);
            } else {
              res.redirect(`/start/${exercise.TrainingId}`);
            }
          }
        );
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

// exports.getPerformances = (req, res, next) => {
//   let message = getErrors(req);
//   const userId = req.user.id;
//   Exercises.findOne({ where: { UserId: userId } })
//     .then(exercise => {
//       const exerciseData = getExerciseData(exercise, false);
//       res.render('admin/performance', {
//         path: '/performance',
//         pageTitle: 'Mes performances',
//         prevPath: undefined,
//         user: false,
//         errorMessage: message,
//         validationErrors: [],
//         isAuth: true,
//         exercise: exerciseData,
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(err);
//     });
// }

exports.getDelete = (req, res, next) => {
  const userId = req.user.id;
  const elementId = req.params.id;
  const elementToDelete = req.params.element;
  switch (elementToDelete) {
    case 'program':
      Programs.destroy({ where: { UserId: userId, id: elementId } }).then(
        result => {
          console.log('Program deleted successfully');
          res.redirect('/programs');
        }
      );
      break;
    case 'exercise':
      Exercises.findOne({ where: { UserId: userId, id: elementId } }).then(
        exercise => {
          const trainingId = exercise.TrainingId;
          return exercise.destroy().then(result => {
            Trainings.findOne({
              where: { UserId: userId, id: trainingId },
            }).then(training => {
              console.log('Exercise deleted successfully');
              if(training.ProgramId){
                res.redirect(`/newtraining/${training.ProgramId}/${trainingId}`);
              } else {
                res.redirect(`/newexpresstraining/${trainingId}`);
              }
            });
          });
        }
      );
      break;
    case 'training':
      Trainings.findOne({ where: { UserId: userId, id: elementId } }).then(
        training => {
          const programId = training.ProgramId;
          return training.destroy().then(result => {
            console.log('Training deleted successfully');
            if (programId !== null) {
              res.redirect(`/newprogram/${programId}`);
            } else {
              res.redirect(`/trainings`);
            }
          });
        }
      );
      break;
    case 'user':
      Users.destroy({ where: { UserId: userId, id: elementId } }).then(
        result => {
          Programs.destroy({ where: { UserId: userId } });
          Exercises.destroy({ where: { UserId: userId } });
          Trainings.destroy({ where: { UserId: userId } });
          req.session.destroy(err => {
            console.log('User deleted successfully');
            console.log(err);
            res.redirect('/signup');
          });
        }
      );
      break;
  }
};
