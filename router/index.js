const Router = require('koa-router')
const router = new Router()
const weixin = require('./weixin')
const xcx = require('./xcx')

router.use('/weixin', weixin.routes(), weixin.allowedMethods())
router.use('/xcx', xcx.routes(), xcx.allowedMethods())

router.get('/', async (ctx, next) => {
  await ctx.render("./index", {title: "chunyu欢迎您"});
})

module.exports = router