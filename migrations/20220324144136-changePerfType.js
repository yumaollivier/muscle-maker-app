'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Exercises', 'performances',
      {
        type: DataTypes.TEXT,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Exercises', 'performances',
      {
        type: DataTypes.STRING,
      }
    );
  }
};
