const {Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../database/database');

const userSchema = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  pseudo: DataTypes.STRING,
  email: DataTypes.STRING,
  age: DataTypes.INTEGER,
  password: DataTypes.STRING,
  resetToken: DataTypes.STRING,
  resetTokenExpiration: DataTypes.DATE,
});

module.exports = userSchema;