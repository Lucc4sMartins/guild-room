'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tradings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      guild_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'guilds',
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
      },
      base_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'base_items',
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
      },
      is_upgradable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      upgrade: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      slots: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      pieces: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tradings')
  }
};
