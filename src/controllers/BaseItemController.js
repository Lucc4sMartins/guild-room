const BaseItem = require('../models/BaseItem')
const Guild = require('../models/Guild')
const Log = require('../models/Log')
const ErrorHandler = require ('../helpers/ErrorHandler')
const { QueryTypes } = require('sequelize')
const sequelize = require('../database/index')

module.exports = {
  List: async (req, res) => {
    const { guild_id } = req.params

    if (!guild_id) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const baseItems = await BaseItem.findAll({
        where: {
          guild_id
        }
      })

      return res.json(baseItems)
    } catch (e) {
      console.error(e)
      ErrorHandler.InternalServerError(res)
    }
  },
  ListCategories: async (req, res) => {
    const { guild_id } = req.params

    if (!guild_id) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const baseItems = await sequelize.query('SELECT DISTINCT category FROM base_items WHERE guild_id = :guild_id', {
        replacements: { guild_id },
        type: QueryTypes.SELECT
      })

      return res.json(baseItems)
    } catch (e) {
      console.error(e)
      ErrorHandler.InternalServerError(res)
    }
  },
  Create: async (req, res) => {
    const { category, name, img_url } = req.body
    const { guild_id } = req.params

    if (!category || !name || !img_url || !guild_id) {
      return ErrorHandler.MissingRequiredParams(res, 'category | name | img_url | guild_id')
    }
    
    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const baseItem = await BaseItem.create({
        category,
        name,
        img_url,
        guild_id
      })

      Log.create({
        category: 'BaseItem',
        action: 'CREATE',
        user_id: req.userId,
        guild_id,
        description: `Created BaseItem with name ${name}, category ${category} and img ${img_url}`
      })
			
      return res.json(baseItem)
    } catch (e) {
    	console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  }
}