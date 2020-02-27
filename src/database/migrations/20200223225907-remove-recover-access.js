'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'passwordResetToken')
      .then(() => queryInterface.removeColumn('users', 'passwordResetExpire'))
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'passwordResetToken', {
      type: Sequelize.STRING,
      allowNull: true
    }).then(() => queryInterface.addColumn('users', 'passwordResetExpire', {
      type: Sequelize.DATE,
      allowNull: true
    }))
  }
};
