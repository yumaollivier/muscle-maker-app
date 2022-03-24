const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database/database');

const exerciseSchema = sequelize.define('Exercise', {
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
  schema: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
  notes: DataTypes.TEXT,
  performances: {
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

module.exports = exerciseSchema;
