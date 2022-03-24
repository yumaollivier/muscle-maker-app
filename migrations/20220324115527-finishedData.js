'use strict';

const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'Exercises',
          'finished',
          {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'Trainings',
          'finished',
          {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Exercises', 'finished', {
          transaction: t,
        }),
        queryInterface.removeColumn('Trainings', 'finished', {
          transaction: t,
        }),
      ]);
    });
  },
};
