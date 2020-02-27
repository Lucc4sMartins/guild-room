const BaseItem = require('../models/BaseItem')
const Guild = require('../models/Guild')
const User = require('../models/User')
const Trading = require('../models/Trading')
const Log = require('../models/Log')
const ErrorHandler = require ('../helpers/ErrorHandler')

const VALID_TALICS = [
  'keen',
  'destruction',
  'darkness',
  'chaos',
  'hatred',
  'favor',
  'wisdom',
  'sacred_fire',
  'belief',
  'guard',
  'glory',
  'grace',
  'mercy'
]

const VALID_TRADE_TYPES = [
  'sell',
  'buy'
]

module.exports = {
  List: async (req, res) => {
    const { guild_id } = req.params
    const { limit = 100, offset = 0 } = req.query

    if (!guild_id) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id')
    }

    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }

      const { count, rows: tradings } = await Trading.findAndCountAll({
        attributes: ['id', 'is_upgradable', 'upgrade', 'slots', 'pieces', 'type', 'createdAt', 'updatedAt'],
        where: {
          guild_id
        },
        include: [
          {
            association: 'item',
            attributes: ['id', 'category', 'name', 'img_url']
          },
          {
            association: 'user',
            attributes: ['id', 'nickname']
          }
        ],
        limit,
        offset
      })

      return res.json({
        items: tradings,
        limit,
        offset,
        total: count
      })
    } catch (e) {
      console.error(e)
      ErrorHandler.InternalServerError(res)
    }
  },
  Create: async (req, res) => {
    const { is_upgradable, upgrade, slots, pieces, type, talic } = req.body
    const { guild_id, base_item_id } = req.params

    if (!guild_id || !base_item_id || !type) {
      return ErrorHandler.MissingRequiredParams(res, 'guild_id | base_item_id | type')
    }
    
    if (is_upgradable && (!upgrade || !slots || !talic)) {
      return ErrorHandler.MissingRequiredParams(res, 'upgrade | slots | talic')
    }
    
    try {
      const guild = await Guild.findByPk(guild_id)

      if (!guild) {
        return ErrorHandler.NotFound(res, 'Guild')
      }
    
    	if (is_upgradable) {
    		if (upgrade > 7 || slots > 7) {
    			return ErrorHandler.BadRequest(res, 'Slots and upgrade fields can\'t be greater than 7')
        }

    		if (!VALID_TALICS.includes(talic)) {
    			return ErrorHandler.BadRequest(res, `Invalid talic. Possible talics: ${VALID_TALICS.join(', ')}`)
        }
      }
    	
    	if (!VALID_TRADE_TYPES.includes(type)) {
    		return ErrorHandler.BadRequest(res, `Invalid type. Possible types: ${VALID_TRADE_TYPES.join(', ')}`)
      }
    	
    	const trade = await Trading.create({
        base_item_id,
        guild_id,
        user_id: req.userId,
        is_upgradable,
        upgrade,
        slots,
        pieces,
        type,
        talic
      })
			
      return res.json(trade)
    } catch (e) {
    	console.error(e)
      return ErrorHandler.InternalServerError(res)
    }
  },
  Edit: async (req, res) => {
  	
  },
  Delete: async (req, res) => {
  	
  }
}