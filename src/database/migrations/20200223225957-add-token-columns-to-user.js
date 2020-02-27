'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'password_reset_token', {
      type: Sequelize.STRING,
      allowNull: true
    }).then(() => queryInterface.addColumn('users', 'password_reset_expire', {
      type: Sequelize.DATE,
      allowNull: true
    }))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'password_reset_token')
      .then(() => queryInterface.removeColumn('users', 'password_reset_expire'))
  }
};
