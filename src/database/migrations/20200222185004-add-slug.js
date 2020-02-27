'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('guilds', 'slug', {
      type: Sequelize.STRING,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('guilds', 'slug')
  }
};
