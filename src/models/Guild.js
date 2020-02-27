const { Model, DataTypes } = require('sequelize')

class Guild extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      status: DataTypes.STRING
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: 'guild_id', as: 'users' })
    this.hasMany(models.Log, { foreignKey: 'guild_id', as: 'logs' })
    this.hasMany(models.BaseItem, { foreignKey: 'guild_id', as: 'base_items' })
    this.hasMany(models.Trading, { foreignKey: 'guild_id', as: 'tradings' })
  }
}

module.exports = Guild