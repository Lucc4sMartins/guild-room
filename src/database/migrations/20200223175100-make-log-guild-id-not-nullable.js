'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('logs', 'guild_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'guilds',
        key: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('logs', 'guild_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'guilds',
        key: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    })
  }
};
