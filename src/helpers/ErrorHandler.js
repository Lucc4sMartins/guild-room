module.exports = {
  InternalServerError: res => res.status(500).json({
    type: 'INTERNAL SERVER ERROR',
    message: 'Sorry, something went wrong.'
  }),
  Conflict: (res, message, fields) => res.status(409).json({
    type: 'CONFLICT',
    message,
    fields
  }),
  MissingRequiredParams: (res, fields) => res.status(422).json({
    type: 'UNPROCESSABLE ENTITY',
    message: 'Missing required param(s).',
    fields
  }),
  NotFound: (res, resource) => res.status(404).json({
    type: 'NOT FOUND',
    message: 'Resource not found',
    resource
  }),
  Unauthorized: (res, message) => res.status(401).json({
    type: 'UNAUTHORIZED',
    message
  }),
  Forbidden: (res) => res.status(403).json({
    type: 'FORBIDDEN',
    message: 'You don\'t have permission to do that'
  }),
  BadRequest: (res, message) => res.status(400).json({
    type: 'BAD REQUEST',
    message
  })
}