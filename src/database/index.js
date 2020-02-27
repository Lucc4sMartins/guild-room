const Sequelize = require('sequelize')
const dbConfig = require('../config/database')

// models
const User = require('../models/User')
const Guild = require('../models/Guild')
const Log = require('../models/Log')
const BaseItem = require('../models/BaseItem')
const Trading = require('../models/Trading')

const connection = new Sequelize(dbConfig)

User.init(connection)
Guild.init(connection)
Log.init(connection)
BaseItem.init(connection)
Trading.init(connection)

User.associate(connection.models)
Log.associate(connection.models)
BaseItem.associate(connection.models)
Trading.associate(connection.models)

module.exports = connection