const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database/database');

const trainingSchema = sequelize.define('Training', {
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
  exerciseIds: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  finished: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
});

module.exports = trainingSchema;
