const { Model, DataTypes } = require('sequelize')
const bcrypt = require('bcrypt')

class User extends Model {
  static init(sequelize) {
    super.init({
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      points: DataTypes.INTEGER,
      status: DataTypes.STRING,
      role: DataTypes.STRING,
      password_reset_token: DataTypes.STRING,
      password_reset_expire: DataTypes.DATE
    }, {
      sequelize,
      hooks: {
        beforeCreate: async (user, options) => {
          user.password = await bcrypt.hash(user.password, 10)
        }
      }
    })
  }

  static associate(models) {
    this.belongsTo(models.Guild, { foreignKey: 'guild_id', as: 'guild' })
    this.hasMany(models.Log, { foreignKey: 'user_id', as: 'logs' })
    this.hasMany(models.Trading, { foreignKey: 'user_id', as: 'tradings' })
  }

}

module.exports = User