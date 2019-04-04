const Koa = require('koa')
const xmlParser = require('koa-xml-body')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const path = require('path')
const nunjucks = require('koa-nunjucks-2')
const staticFiles = require('koa-static')
const db = require('./lib/db')
const router = require('./router')
const app = new Koa()
app.keys = ['weixin']

app.use(staticFiles(path.resolve(__dirname, "web/public")))
app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'web/views'),
  nunjucksConfig: {
    trimBlocks: true
  }
}))

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}
app.use(session(CONFIG, app))

// 进行xml解析
app.use(xmlParser())
// 进行requestbody解析
app.use(bodyParser())
// 连接mongodb
// db(app)
// 加入路由
app.use(router.routes(), router.allowedMethods())

app.listen(3005)