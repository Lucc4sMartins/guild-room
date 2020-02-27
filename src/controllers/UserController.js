const User = require('../models/User')
const Guild = require('../models/Guild')
const Log = require('../models/Log')
const JWT = require('jsonwebtoken')
const authConfig = require('../config/auth')
const ErrorHandler = require ('../helpers/ErrorHandler')

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

      const users = await User.findAll({
        attributes: ['id', 'email', 'nickname', 'points', 'status'],
        where: {
          guild_id
        }
      })

      return res.json(users)
    } catch (e) {
      console.error(e)
      ErrorHandler.InternalServerError(res)
    }
  },
  Create: async (req, res) => {
    const { nickname, email, password } = req.body
    const { guild_id } = req.params

    if (!nickname || !email || !password || !guild_id) {
      return ErrorHandler.MissingRequiredParams(res, 'nickname | email | password | guild_id')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      if (await User.findOne({ where: { email, guild_id } })) {
        return ErrorHandler.Conflict(res, 'Email already taken', 'email')
      }
      if (await User.findOne({ where: { nickname, guild_id } })) {
        return ErrorHandler.Conflict(res, 'Nickname already taken', 'nickname')
      }

      const {
        id,
        updatedAt,
        createdAt,
        points,
        status,
        role
      } = await User.create({
        email,
        nickname,
        password,
        guild_id
      })

      const token = JWT.sign({ id, role, guild_id, status }, authConfig.secret, { expiresIn: '7d' })

      Log.create({
        guild_id,
        user_id: id,
        description: `Signed up with email ${email}`,
        category: 'User',
        action: 'CREATE'
      })

      return res.json({
        id,
        email,
        nickname,
        updatedAt,
        createdAt,
        points,
        status,
        token,
        guild: guild.name
      })
    } catch (e) {
      console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  },
  MassActive: async (req, res) => {
    const { users } = req.body
    const { guild_id } = req.params

    if (!users || !guild_id) {
      return ErrorHandler.MissingRequiredParams(res, 'users | guild_id')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const selectedUsers = await User.findAll({ where: { id: users, guild_id }})

      if (!selectedUsers || selectedUsers.length === 0) {
        return ErrorHandler.NotFound(res, 'User')
      }

      await User.update({ status: 'ACTIVE' }, { where: { id: users, guild_id } })

      const selectedUserNicknames = selectedUsers.map(user => user.nickname).join(', ')

      Log.create({
        guild_id,
        user_id: req.userId,
        description: `Accepted ${selectedUsers.length} users: ${selectedUserNicknames}`,
        category: 'User',
        action: 'UPDATE'
      })

      return res.sendStatus(200)
    } catch (e) {
      console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  }
}