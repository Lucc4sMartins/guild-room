const { Model, DataTypes } = require('sequelize')

class Trading extends Model {
  static init (sequelize) {
    super.init({
      is_upgradable: DataTypes.BOOLEAN,
      upgrade: DataTypes.INTEGER,
      slots: DataTypes.INTEGER,
      pieces: DataTypes.INTEGER,
      type: DataTypes.STRING,
      talic: DataTypes.STRING
    }, {
      sequelize
    })
  }
  
  static associate (models) {
    this.belongsTo(models.Guild, { foreignKey: 'guild_id', as: 'guild' })
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.BaseItem, { foreignKey: 'base_item_id', as: 'item' })
  }
}

module.exports = Trading