const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

class Log extends Model {
  static init(sequelize) {
    super.init({
      description: DataTypes.STRING,
      category: DataTypes.STRING,
      action: DataTypes.STRING
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.Guild, { foreignKey: 'guild_id', as: 'guild' })
  }
}

module.exports = Log