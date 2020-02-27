const ErrorHandler = require('../../helpers/ErrorHandler')

module.exports = role => (req, res, next) => {
  if (req.userRole < role) {
  	return ErrorHandler.Forbidden(res)
  }

  return next()
}
