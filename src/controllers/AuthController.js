const User = require('../models/User')
const Guild = require('../models/Guild')
const Log = require('../models/Log')
const JWT = require('jsonwebtoken')
const authConfig = require('../config/auth')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../helpers/ErrorHandler')
const crypto = require('crypto')
const { addHours, isAfter } = require('date-fns')
const Mailer  = require('../helpers/Mailer')

module.exports = {
  Authenticate: async (req, res) => {
    const { email, password } = req.body
    const { guild_id } = req.params

    if (!guild_id || !email || !password) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id | email | password')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const user = await User.findOne({ where: { email, guild_id } })

      if (!user) {
        return ErrorHandler.Unauthorized(res, 'Wrong credentials')
      } 

      if (!await bcrypt.compare(password, user.password)) {
      	return ErrorHandler.Unauthorized(res, 'Wrong credentials')
      }

      user.password = undefined

      const {
        id,
        nickname,
        updatedAt,
        createdAt,
        points,
        status,
        role
      } = user

      const token = JWT.sign({ id, role, guild_id, status }, authConfig.secret, { expiresIn: '1d' })

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
  ChangePass: async (req, res) => {
    const { currentPassword, newPassword } = req.body
    const { guild_id } = req.params

    if (!guild_id || !currentPassword || !newPassword) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id | currentPassword | newPassword')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const { userId } = req

      const user = await User.findOne({ where: { id: userId, guild_id } })

      if (!await bcrypt.compare(currentPassword, user.password)) {
        return ErrorHandler.Unauthorized(res, 'Wrong credentials')
      }

      const hashedPass = await bcrypt.hash(newPassword, 10)

      await User.update({ password: hashedPass }, { where: { id: userId, guild_id }})

      Log.create({
        guild_id,
        user_id: userId,
        description: 'Updated password',
        category: 'User',
        action: 'UPDATE'
      })

      return res.sendStatus(200)
    } catch (e) {
      console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  },
  RecoverAccess: async (req, res) => {
    const { email } = req.body
    const { guild_id } = req.params

    if (!guild_id || !email) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id | email')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const user = await User.findOne({ where: { email, guild_id } })

      if (!user) return ErrorHandler.NotFound(res, 'User')

      const token = crypto.randomBytes(20).toString('hex')

      const expireDate = addHours(new Date(), 1)

      await User.update({
        password_reset_token: token,
        password_reset_expire: expireDate
      }, {
        where: {
          email,
          guild_id
        }
      })

      return Mailer.sendMail({
        to: email,
        from: 'luccasmartins.nave@gmail.com',
        subject: `Recuperação de acesso - ${guild.name}`,
        template: 'forgot_pass',
        context: { token }
      }, e => {
        if (e) {
          return ErrorHandler.BadRequest(res, 'Fail on sending recover password email')
        }

        return res.json({ success: 'Recover email sent' })
      })
    } catch (e) {
      console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  },
  ResetPass: async (req, res) => {
    const { token, password } = req.body
    const { guild_id } = req.params

    if (!guild_id || !token || !password) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id | token | password')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const user = await User.findOne({ where: { password_reset_token: token, guild_id } })

      if (!user) {
        return ErrorHandler.BadRequest(res, 'Invalid token')
      }

      if (isAfter(new Date(), user.password_reset_expire)) {
        return ErrorHandler.BadRequest(res, 'Expired token, generate a new one')
      }

      const hashedPass = await bcrypt.hash(password, 10)

      await User.update({
        password: hashedPass,
        password_reset_token: null,
        password_reset_expire: null
      }, {
        where: {
          id: user.id,
          guild_id
        }
      })

      return res.json({
        success: 'Password reseted!'
      })
    } catch (e) {
      console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  }
}