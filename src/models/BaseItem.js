const { Model, DataTypes } = require('sequelize')

class BaseItem extends Model {
  static init (sequelize) {
    super.init({
      category: DataTypes.STRING,
      name: DataTypes.STRING,
      img_url: DataTypes.STRING
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Guild, { foreignKey: 'guild_id', as: 'guild' })
    this.hasMany(models.Trading, { foreignKey: 'base_item_id', as: 'tradings' })
  }
}

module.exports = BaseItem