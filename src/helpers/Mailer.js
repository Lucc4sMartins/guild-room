const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const {
  host,
  port,
  user,
  pass
} = require('../config/mail')

const transport = nodemailer.createTransport({
  host,
  port,
  auth: {
    user,
    pass
  }
})

transport.use('compile', hbs({  
  viewEngine: {
    extName: '.html',
    partialsDir: './src/resources/mail/',
    layoutsDir: './src/resources/mail/',
    defaultLayout: ''
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
}))

module.exports = transport