'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('base_items', {
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
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      img_url: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'https://i.imgur.com/aVFvSCg.png'
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
    return queryInterface.dropTable('base_items')
  }
};
