const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../database/database');

const exerciseSchema = sequelize.define('Exercise', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "simple",
  },
  trainingNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "",
  },
  // types "simple", "circuit"
  exerciseIds: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = exerciseSchema;
