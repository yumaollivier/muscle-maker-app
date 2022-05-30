const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database/database');

const exerciseDataSchema = sequelize.define('ExerciseData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  muscleTarget: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "exercise",
  },
  schema: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  performances: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: '',
  },
  programName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  trainingName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  notes: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
  trainingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  finished: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = exerciseDataSchema;
