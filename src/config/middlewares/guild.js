const ErrorHandler = require('../../helpers/ErrorHandler')

module.exports = (req, res, next) => {
  const { params: { guild_id }, guildId } = req
	
  if (guild_id && guildId && guild_id !== guildId) {
    return ErrorHandler.Forbidden(res)
  }
	
  return next()
}