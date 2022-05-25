const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Sequelize = require('sequelize');

const Users = require('../models/users');
const Programs = require('../models/programs');
const Trainings = require('../models/trainings');
const ExerciseDatas = require('../models/exerciseDatas');
const Exercises = require('../models/exercises');

const defaultExercises = require('../utils/exercises.json');
const e = require('connect-flash');

const getErrors = req => {
  let error = req.flash('error');
  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  return error;
};

const sortArray = (array, by = 'date') => {
  if (by === 'date') {
    return array.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
  } else if (by === 'id') {
    return array.sort((a, b) => {
      return a.id - b.id;
    });
  }
};

const allEqual = arr => arr.every(v => v === arr[0]);

const getExerciseIds = exerciseIds => {
  let ids;
  if (exerciseIds.length > 1) {
    ids = exerciseIds.split(',');
    return ids.filter(id => id !== '');
  } else {
    return exerciseIds;
  }
};

const getExerciseData = (exerciseData, minimize = true) => {
  const schema = exerciseData.schema.split('-');
  let stats = exerciseData.performances.split('/');
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
    const exerciseDatas = {
      id: exerciseData.id,
      name: exerciseData.name,
      muscleTarget: exerciseData.muscleTarget,
      type: exerciseData.type,
      set: Math.max(...set),
      reps: allEqual(reps) ? reps[0] : reps.join(', '),
      rest: allEqual(rest) ? rest[0] : rest.join(', '),
      notes: exerciseData.notes,
      TrainingId: exerciseData.trainingId,
      finished: exerciseData.finished,
    };
    return exerciseDatas;
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
    const performance = [];
    // {date: date, stats:[{set: 1, reps: 10, weight: 100, rest: 60}, {set: 2, reps: 10, weight: 100, rest: 60}]}
    stats.forEach(stat => {
      if (stat !== '') {
        const fullStats = stat.split('-');
        const date = fullStats.shift();
        const setStat = {};
        setStat.date = date;
        setStat.stats = [];
        fullStats.forEach(fullStat => {
          const statistic = {};
          const setPerf = fullStat.split(',');
          const setNumber = setPerf[0];
          const repsNumber = setPerf[1];
          const weight = setPerf[2];
          const restTime = setPerf[3];
          const notes = setPerf[4];
          statistic.set = setNumber;
          statistic.reps = repsNumber;
          statistic.weight = weight;
          statistic.rest = restTime;
          statistic.notes = notes;
          setStat.stats.push(statistic);
        });
        performance.push(setStat);
      }
    });
    const exerciseDatas = {
      id: exerciseData.id,
      name: exerciseData.name,
      muscleTarget: exerciseData.muscleTarget,
      type: exerciseData.type,
      set: Math.max(...set),
      reps: allEqual(reps) ? reps[0] : reps.join(', '),
      rest: allEqual(rest) ? rest[0] : rest.join(', '),
      schema: schemaData,
      notes: exerciseData.notes,
      performances: performance,
      TrainingId: exerciseData.trainingId,
      finished: exerciseData.finished,
    };
    return exerciseDatas;
  }
};

const getExercises = (trainingExercise, exerciseDatas) => {
  const exerciseData = { id: trainingExercise.id };
  const exerciseIds = getExerciseIds(trainingExercise.exerciseIds);
  if (exerciseIds.length > 1) {
    exerciseData.type = 'circuit';
    exerciseData.exercisesList = [];
    exerciseIds.forEach(exerciseId => {
      const exercise = exerciseDatas.find(
        exercise => exercise.id == exerciseId
      );
      const data = getExerciseData(exercise, false);
      exerciseData.finished = data.finished;
      exerciseData.exercisesList.push(data);
    });
  } else {
    exerciseData.type = 'simple';
    const exercise = exerciseDatas.find(exercise => exercise.id == exerciseIds);
    const data = getExerciseData(exercise, false);
    exerciseData.finished = data.finished;
    exerciseData.exercisesList = data;
  }
  exerciseData.trainingNotes = trainingExercise.trainingNotes;
  return exerciseData;
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
    req.user.createProgram({}).then(program => {
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
  let exercises = [];
  if (trainingId !== undefined) {
    Trainings.findOne({
      where: { UserId: req.user.id, ProgramId: programId, id: trainingId },
    }).then(training => {
      const trainingId = training.id;
      Exercises.findAll({
        where: { UserId: req.user.id, TrainingId: trainingId },
      }).then(trainingExercises => {
        ExerciseDatas.findAll({ where: { trainingId: trainingId } }).then(
          exerciseDatas => {
            trainingExercises.forEach(trainingExercise => {
              const exercise = getExercises(trainingExercise, exerciseDatas);
              exercises.push(exercise);
            });
            exercises = sortArray(exercises, 'id');
            return res.render('admin/newtraining', {
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
        );
      });
    });
  } else {
    Programs.findOne({ where: { UserId: req.user.id, id: programId } }).then(
      program => {
        program
          .createTraining({
            ProgramId: programId,
            programName: program.name,
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
  Trainings.findOne({
    where: { UserId: req.user.id, id: req.body.trainingId },
  })
    .then(training => {
      ExerciseDatas.findAll({ where: { trainingId: training.id } }).then(
        exerciseDatas => {
          training.name = name;
          training.muscleTarget = muscleTarget;
          training.numberOfExercises = exerciseDatas.length;
          return training.save().then(training => {
            switch (inputValue) {
              case 'Enregistrer':
                res.redirect(`/newprogram/${training.ProgramId}`);
                break;
              case 'Commencer':
                res.redirect(`/start/${training.id}`);
                break;
              default:
                res.redirect(`/newexercise/${training.id}`);
            }
          });
        }
      );
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
          ExerciseDatas.findAll({ where: { trainingId: trainingId } }).then(
            exerciseDatas => {
              trainingExercises.forEach(trainingExercise => {
                const exercise = getExercises(trainingExercise, exerciseDatas);
                exercises.push(exercise);
              });
            }
          );
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
      .createTraining({})
      .then(training => {
        console.log('New Training created');
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
    ExerciseDatas.findOne({
      where: {
        id: exerciseId,
        trainingId: trainingId,
      },
    }).then(exerciseDatas => {
      Trainings.findOne({
        where: { UserId: req.user.id, id: trainingId },
      }).then(training => {
        const exerciseData = getExerciseData(exerciseDatas, false);
        res.render('admin/newexercise', {
          path: `/newexercise/${exerciseId}`,
          pageTitle: 'Modifier un exercice',
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          exercise: exerciseData,
          programId: training.ProgramId,
          firstExerciseSetNumber: 0,
          defaultExercises,
        });
      });
    });
  } else {
    Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } }).then(
      training => {
        const exercise = null;
        res.render('admin/newexercise', {
          path: `/newexercise/${training.id}`,
          pageTitle: 'Ajouter un exercice',
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          programId: training.ProgramId,
          firstExerciseSetNumber: 0,
          exercise,
          defaultExercises,
        });
      }
    );
  }
};

exports.postNewExercise = (req, res, next) => {
  let message = getErrors(req);
  const userId = req.user.id;
  const inputValue = req.body.submitAction;
  const exerciseId = req.params.exerciseId;
  const trainingId = req.params.trainingId;
  const name = req.body.exerciseName;
  const muscleTarget = req.body.muscleTarget;
  const setSchema = req.body.exerciseSchema;
  const notes = req.body.trainingNotes;
  Trainings.findOne({ where: { UserId: userId, id: trainingId } }).then(
    training => {
      if (exerciseId) {
        Exercises.findOne({
          where: {
            exerciseIds: { [Sequelize.Op.like]: `%${exerciseId}%` },
            TrainingId: trainingId,
          },
        }).then(exercise => {
          ExerciseDatas.findByPk(exerciseId)
            .then(exerciseDatas => {
              exerciseDatas.name = name;
              exerciseDatas.muscleTarget = muscleTarget;
              exerciseDatas.schema = setSchema;
              exerciseDatas.notes = notes;
              return exerciseDatas.save();
            })
            .then(exerciseDatas => {
              if (inputValue === 'Lier avec un autre exercice') {
                const exerciseIds = getExerciseIds(exercise.exerciseIds);
                res.redirect(
                  `/newexercise/${trainingId}/circuit/${exerciseIds[0]}`
                );
              } else if (training.ProgramId) {
                res.redirect(
                  `/newtraining/${training.ProgramId}/${trainingId}`
                );
              } else {
                res.redirect(`/newexpresstraining/${trainingId}`);
              }
            })
            .catch(err => {
              const error = new Error(err);
              error.httpStatusCode = 500;
              return next(err);
            });
        });
      } else {
        training.numberOfExercises += 1;
        training.save();
        training
          .createExercise({
            type: 'simple',
            UserId: userId,
          })
          .then(exercise => {
            ExerciseDatas.create({
              name: name,
              muscleTarget: muscleTarget,
              schema: setSchema,
              notes: notes,
              trainingId: training.id,
              userId: userId,
              programName: training.programName,
              trainingName: training.name,
            }).then(exerciseData => {
              console.log('New Exercise Created');
              exercise.exerciseIds = exerciseData.id;
              exercise.save();
              if (inputValue === 'Lier avec un autre exercice') {
                res.redirect(
                  `/newexercise/${trainingId}/circuit/${exerciseData.id}`
                );
              } else if (training.ProgramId) {
                res.redirect(
                  `/newtraining/${training.ProgramId}/${training.id}`
                );
              } else {
                res.redirect(`/newexpresstraining/${training.id}`);
              }
            });
          });
      }
    }
  );
};

exports.getNewCircuit = (req, res, next) => {
  let message = getErrors(req);
  const exercise = null;
  const firstExerciseId = req.params.firstExerciseId;
  const trainingId = req.params.trainingId;
  Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } }).then(
    training => {
      ExerciseDatas.findByPk(firstExerciseId).then(firstExerciseDatas => {
        // reset rest under sets to 0 for the first exercise
        const schema = firstExerciseDatas.schema.split('-');
        const newSchema = [];
        schema.forEach(schema => {
          let schemaDetails = schema.split(',');
          schemaDetails[2] = 0;
          schemaDetails.join(',');
          newSchema.push(schemaDetails);
        });
        firstExerciseDatas.schema = newSchema.join('-');
        return firstExerciseDatas.save().then(firstExerciseDatas => {
          const exerciseData = getExerciseData(firstExerciseDatas);
          const setNumber = exerciseData.set;
          res.render('admin/newexercise', {
            path: `/newexercise/${trainingId}/circuit/${firstExerciseId}`,
            pageTitle: 'Lier un exercice',
            user: false,
            errorMessage: message,
            validationErrors: [],
            isAuth: true,
            exercise,
            programId: training.ProgramId,
            defaultExercises,
            firstExerciseSetNumber: setNumber,
          });
        });
      });
    }
  );
};

exports.postNewCircuit = (req, res, next) => {
  const name = req.body.exerciseName;
  const muscleTarget = req.body.muscleTarget;
  const setSchema = req.body.exerciseSchema;
  const notes = req.body.trainingNotes;
  const firstExerciseId = req.params.firstExerciseId;
  const trainingId = req.params.trainingId;
  const inputValue = req.body.submitAction;
  Trainings.findByPk(trainingId).then(training => {
    Exercises.findOne({
      where: {
        exerciseIds: { [Sequelize.Op.like]: `%${firstExerciseId}%` },
        TrainingId: trainingId,
      },
    }).then(exercise => {
      ExerciseDatas.create({
        name: name,
        muscleTarget: muscleTarget,
        schema: setSchema,
        notes: notes,
        trainingId: trainingId,
        userId: req.user.id,
      }).then(exerciseData => {
        training.numberOfExercises += 1;
        training.save();
        console.log('New Exercise Created');
        exercise.exerciseIds += `,${exerciseData.id}`;
        exercise.type = 'circuit';
        exercise.save();
        if (
          inputValue === "Ajouter l'exercice" ||
          inputValue === "Modifier l'exercice"
        ) {
          if (training.ProgramId) {
            res.redirect(`/newtraining/${training.ProgramId}/${trainingId}`);
          } else {
            res.redirect(`/newexpresstraining/${trainingId}`);
          }
        } else {
          if (req.originalUrl.includes('circuit')) {
            res.redirect(
              `/newexercise/${trainingId}/circuit/${req.params.firstExerciseId}`
            );
          } else {
            res.redirect(
              `/newexercise/${trainingId}/circuit/${exerciseData.id}`
            );
          }
        }
      });
    });
  });
};

exports.getExercise = (req, res, next) => {
  let message = getErrors(req);
  const exerciseId = req.params.exerciseId;
  ExerciseDatas.findOne({ where: { id: exerciseId } })
    .then(exerciseDatas => {
      const exerciseData = getExerciseData(exerciseDatas, false);
      res.render('admin/exercise', {
        path: '/exercise',
        pageTitle: exerciseDatas.name,
        errorMessage: message,
        validationErrors: [],
        isAuth: true,
        exercise: exerciseData,
        trainingId: exerciseDatas.TrainingId,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

// exports.getExerciseStat = (req, res, next) => {
//   let message = getErrors(req);
//   const exerciseId = req.params.exerciseId;
//   Exercises.findOne({where: {exerciseIds: { [Sequelize.Op.like]: `%${exerciseId}%` }} }).then(trainingExercise => {
//     const trainingNotes = trainingExercise.trainingNotes;
//     ExerciseDatas.findOne({ where: { id: exerciseId } })
//       .then(exerciseDatas => {
//         ExerciseDatas.findAll({ where: {name: exerciseDatas.name}}).then(exerciseData => {
//           const exerciseDataArray = []
//           exerciseData.forEach(ex => {
//             const data = getExerciseData(ex, false);
//             exerciseDataArray.push(data)
//           })
//           res.render('admin/exercisestat', {
//             path: '/exercisestat',
//             pageTitle: exerciseDatas.name,
//             errorMessage: message,
//             validationErrors: [],
//             isAuth: true,
//             exercise: exerciseDataArray,
//             trainingNotes,
//           });
//         })
//       })
//       .catch(err => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(err);
//       });
//   })
// };
exports.getExerciseStat = (req, res, next) => {
  let message = getErrors(req);
  const exerciseId = req.params.exerciseId;
  Exercises.findOne({where: {exerciseIds: { [Sequelize.Op.like]: `%${exerciseId}%` }} }).then(trainingExercise => {
    const trainingNotes = trainingExercise.trainingNotes;
    ExerciseDatas.findOne({ where: { id: exerciseId } })
      .then(exerciseDatas => {
        const exerciseData = getExerciseData(exerciseDatas, false);
        res.render('admin/exercisestat', {
          path: '/exercisestat',
          pageTitle: exerciseDatas.name,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          exercise: exerciseData,
          trainingNotes,
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
      });
  })
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
      Programs.findAll({
        where: { UserId: req.user.id },
      }).then(programs => {
        if (programs) {
          trainings.forEach(training => {
            let programName;
            if (!training.ProgramId) {
              programName = `Séance express ${training.name}`;
            } else {
              const program = programs.find(
                program => program.id === training.ProgramId
              ); // return [{ program targeted }]
              programName = `Programme ${program.name}`;
            }
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

exports.getProgram = (req, res, next) => {
  let message = getErrors(req);
  const programId = req.params.programId;
  Programs.findOne({
    where: { UserId: req.user.id, id: programId },
  })
    .then(program => {
      Trainings.findAll({
        where: { UserId: req.user.id, ProgramId: program.id },
      }).then(trainings => {
        trainings = sortArray(trainings);
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
  let exercises = [];
  Trainings.findOne({
    where: { UserId: req.user.id, id: trainingId },
  })
    .then(training => {
      if (training.numberOfExercises > 0) {
        const trainingId = training.id;
        Exercises.findAll({
          where: { UserId: req.user.id, TrainingId: trainingId },
        }).then(trainingExercises => {
          ExerciseDatas.findAll({ where: { trainingId: trainingId } }).then(
            exerciseDatas => {
              trainingExercises.forEach(trainingExercise => {
                const exercise = getExercises(trainingExercise, exerciseDatas);
                exercises.push(exercise);
              });
              exercises = sortArray(exercises, 'id');
              return res.render('admin/training', {
                path: '/training/',
                pageTitle: training.name,
                user: false,
                errorMessage: message,
                validationErrors: [],
                isAuth: true,
                training,
                exercises,
              });
            }
          );
        });
      } else {
        return res.render('admin/training', {
          path: '/training/',
          pageTitle: training.name,
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          training,
          exercises,
        });
      }
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
  let exercises = [];
  Trainings.findOne({
    where: { UserId: req.user.id, id: trainingId },
  })
    .then(training => {
      const trainingId = training.id;
      Exercises.findAll({
        where: { UserId: req.user.id, TrainingId: trainingId },
      }).then(trainingExercises => {
        ExerciseDatas.findAll({ where: { trainingId: trainingId } }).then(
          exerciseDatas => {
            trainingExercises.forEach(trainingExercise => {
              const exercise = getExercises(trainingExercise, exerciseDatas);
              exercises.push(exercise);
            });
            if (training.ProgramId) {
              Programs.findByPk(training.ProgramId).then(program => {
                exercises = sortArray(exercises, 'id');
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

exports.postStart = (req, res, next) => {
  let message = getErrors(req);
  const trainingId = req.params.trainingId;
  Trainings.findOne({ where: { UserId: req.user.id, id: trainingId } })
    .then(training => {
      training.finished = true;
      return training.save().then(training => {
        if (training.ProgramId) {
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
  Exercises.findByPk(exerciseId)
    .then(exercise => {
      const exerciseIds = getExerciseIds(exercise.exerciseIds);
      ExerciseDatas.findAll({
        where: { id: exerciseIds },
      }).then(exerciseDatas => {
        const exerciseData = getExercises(exercise, exerciseDatas);
        return res.render('admin/startexercise', {
          path: `/startexercise/${exercise.id}`,
          pageTitle: 'Entrainement',
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          exercise: exerciseData,
        });
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
  const exercisePerformances = req.body.exercisePerf.split('|');
  const trainingNotes = req.body.trainingNotes;
  Exercises.findOne({ where: { UserId: userId, id: exerciseId } })
    .then(exercise => {
      const exerciseIds = getExerciseIds(exercise.exerciseIds);
      exercise.trainingNotes = trainingNotes;
      exercise.save()
      ExerciseDatas.findAll({
        where: { id: exerciseIds },
      })
        .then(exerciseDatas => {
          exerciseDatas.forEach((exercise, i) => {
            const perf = exercisePerformances[i];
            exercise.finished = true;
            exercise.performances += perf + '/';
            exercise.save();
          });
        })
        .then(() => {
          Exercises.findAll({
            where: { TrainingId: exercise.TrainingId },
          }).then(exercisesList => {
            let exerciseIndex;
            exercisesList = sortArray(exercisesList, 'id');
            for (let i = 0; i < exercisesList.length; i++) {
              if (exercisesList[i].id === exercise.id) {
                exerciseIndex = i;
              }
            }
            const nextExerciseIndex = exerciseIndex + 1;
            if (
              exerciseIndex + 1 <= exercisesList.length - 1 &&
              exerciseIndex !== undefined
            ) {
              const nextExerciseId = exercisesList[nextExerciseIndex].id;
              res.redirect(`/startexercise/${nextExerciseId}`);
            } else {
              res.redirect(`/start/${exercise.TrainingId}`);
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

exports.getStats = (req, res, next) => {
  let message = getErrors(req);
  const userId = req.user.id;
  const muscleTarget = req.params.muscleTarget;
  if (muscleTarget) {
    ExerciseDatas.findAll({
      where: {
        userId: userId,
        muscleTarget: { [Sequelize.Op.like]: `%${muscleTarget}%` },
      },
    })
      .then(exerciseDatas => {
        res.render('admin/statisticgroup', {
          path: '/statistic',
          pageTitle: 'Mes stats',
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          muscleTarget,
          exerciseDatas,
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
      });
  } else {
    ExerciseDatas.findAll({ where: { userId: userId } })
      .then(exercises => {
        let musclesTargeted = [];
        exercises.forEach(exercise => {
          const muscleTarget = exercise.muscleTarget.split(' ');
          muscleTarget.forEach(muscle => {
            if (
              !musclesTargeted.find(item => {
                return item.muscleName == muscle;
              })
            ) {
              const muscleObject = {
                muscleName: muscle,
                quantityOfExercise: 1,
              };
              musclesTargeted.push(muscleObject);
            } else {
              const obj = musclesTargeted.find(item => {
                return item.muscleName === muscle;
              });
              obj.quantityOfExercise++;
            }
          });
        });

        res.render('admin/statistic', {
          path: '/statistic',
          pageTitle: 'Mes stats',
          user: false,
          errorMessage: message,
          validationErrors: [],
          isAuth: true,
          musclesTargeted,
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
      });
  }
};

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
      Exercises.findOne({
        where: {
          exerciseIds: { [Sequelize.Op.like]: `%${elementId}%` },
        },
      }).then(exercise => {
        const trainingId = exercise.TrainingId;
        Trainings.findOne({
          where: { UserId: userId, id: trainingId },
        }).then(training => {
          training.numberOfExercises -= 1;
          training.save();
          const exerciseIds = getExerciseIds(exercise.exerciseIds);
          if (exerciseIds.length > 1) {
            const idsFiltered = exerciseIds.filter(id => id !== elementId);
            if (idsFiltered.length > 0) {
              if (idsFiltered.length === 1) {
                exercise.type = 'simple';
              }
              const idsStr = idsFiltered.join(',');
              exercise.exerciseIds = idsStr;
              exercise.save();
            } else {
              exercise.destroy();
            }
          } else {
            exercise.destroy();
          }
          return ExerciseDatas.destroy({ where: { id: elementId } }).then(
            result => {
              console.log('Exercise deleted successfully');
              if (training.ProgramId) {
                res.redirect(
                  `/newtraining/${training.ProgramId}/${trainingId}`
                );
              } else {
                res.redirect(`/newexpresstraining/${trainingId}`);
              }
            }
          );
        });
      });
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
