'use strict'

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users', {
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
			nickname: {
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			points: {
				type: Sequelize.INTEGER,
				defaultValue: 0
			},
			status: {
				type: Sequelize.STRING,
				defaultValue: 'PENDING'
			},
			role: {
				type: Sequelize.INTEGER,
				defaultValue: 0
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
		return queryInterface.dropTable('users')
	}
}
