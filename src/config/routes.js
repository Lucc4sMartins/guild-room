const express = require('express')
const authMiddleware = require('../config/middlewares/auth')
const guildMiddleware = require('../config/middlewares/guild')
const roleMiddleware = require('./middlewares/role')
const UserController = require('../controllers/UserController')
const GuildController = require('../controllers/GuildController')
const AuthController = require('../controllers/AuthController')
const BaseItemController = require('../controllers/BaseItemController')
const TradingController = require('../controllers/TradingController')

const PLAYER = 0
const MOD = 1
const ADMIN = 2
const ROOT = 3

const routes = express.Router()

routes.use(authMiddleware)

routes.get('/health', (req, res) => res.json({ ok: true }))

routes.post('/guilds/:guild_id/users/signup', guildMiddleware, UserController.Create)
routes.post('/guilds/:guild_id/users/signin', guildMiddleware, AuthController.Authenticate)
routes.post('/guilds/:guild_id/users/recover', guildMiddleware, AuthController.RecoverAccess)
routes.post('/guilds/:guild_id/users/reset', guildMiddleware, AuthController.ResetPass)

routes.get('/guilds', GuildController.List)
routes.post('/guilds', roleMiddleware(ROOT), GuildController.Create)

routes.get('/guilds/:guild_id/users', guildMiddleware, UserController.List)
routes.post('/guilds/:guild_id/users/change_pass', guildMiddleware, AuthController.ChangePass)
routes.post('/guilds/:guild_id/users/activate', guildMiddleware, roleMiddleware(MOD), UserController.MassActive)

routes.get('/guilds/:guild_id/base_items', guildMiddleware, BaseItemController.List)
routes.get('/guilds/:guild_id/base_items/categories', guildMiddleware, BaseItemController.ListCategories)
routes.post('/guilds/:guild_id/base_items', guildMiddleware, roleMiddleware(MOD), BaseItemController.Create)

routes.post('/guilds/:guild_id/base_items/:base_item_id/tradings', guildMiddleware, TradingController.Create)
routes.get('/guilds/:guild_id/tradings', guildMiddleware, TradingController.List)

module.exports = routes