'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tradings', 'talic', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tradings', 'talic')
  }
};
