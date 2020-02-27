const jwt = require('jsonwebtoken')
const authConfig = require('../auth')
const ErrorHandler = require('../../helpers/ErrorHandler')

module.exports = (req, res, next) => {
  const noAuthRoutes = [
    /\/health/,
    /\/guilds\/.*\/users\/signup/,
    /\/guilds\/.*\/users\/signin/,
    /\/guilds\/.*\/users\/recover/,
    /\/guilds\/.*\/users\/reset/
  ]

  const {
    headers: {
      authorization
    },
    path
  } = req

  for (let i = 0; i < noAuthRoutes.length; i++) {
    if (noAuthRoutes[i].test(path)) return next()
  }

  if (!authorization) {
    return ErrorHandler.Unauthorized(res, 'No token provided')
  }

  const parts = authorization.split(' ')

  if (parts.length !== 2) {
    return ErrorHandler.Unauthorized(res, 'Wrong token format, expected: Bearer <Token>')
  }

  const [authType, token] = parts

  if (authType !== 'Bearer') {
    return ErrorHandler.Unauthorized(res, 'Wrong auth type. Available auth types: Bearer')
  }

  return jwt.verify(token, authConfig.secret, (err, decoded) => {
    if (err) {
      return ErrorHandler.Unauthorized(res, 'Invalid token')
    }

    const {
      id: decodedUserId,
      role: decodedUserRole,
      status: decodedUserStatus,
      guild_id: decodedGuildId
    } = decoded

    if (decodedUserStatus !== 'ACTIVE') {
      return ErrorHandler.Unauthorized(res, `Users with status ${decodedUserStatus} can't perform this action`)
    }

    req.userId = decodedUserId
    req.userRole = decodedUserRole
    req.guildId = decodedGuildId
    return next()
  })
}
