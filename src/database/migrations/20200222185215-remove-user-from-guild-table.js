'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('guilds', 'user_id')
  },

  down: (queryInterface, Sequelize) => {
  }
};
