const Router = require('koa-router')
const xcx = new Router()
const xcxController = require('../../controller/xcx')

xcx.post('/login', xcxController.login)
  .post('/weRunData', xcxController.weRunData)

module.exports = xcx