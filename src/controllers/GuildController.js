const Guild = require('../models/Guild')
const Log = require('../models/Log')
const ErrorHandler = require ('../helpers/ErrorHandler')

module.exports = {
  List: async (req, res) => {
  	const guilds = await Guild.findAll()

    return res.json(guilds)
  },
  Create: async (req, res) => {
    const { name, slug } = req.body

    try {
      if (!name || !slug) {
      	return ErrorHandler.MissingRequiredParams(res, 'name | slug')
      }

      if (await Guild.findOne({ where: { name } })) {
      	return ErrorHandler.Conflict(res, 'Name already taken', 'name')
      } 
			
      if (await Guild.findOne({ where: { slug } })) {
        return ErrorHandler.Conflict(res, 'Slug already taken', 'slug')
      }

      const guild = await Guild.create({ name, slug })

      Log.create({
        guild_id: guild.id,
        user_id: req.userId,
        description: 'Created the guild',
        category: 'Guild',
        action: 'Create'
      })

      return res.json(guild)
    } catch (e) {
      console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  }
}