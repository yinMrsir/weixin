const Koa = require('koa')
const xmlParser = require('koa-xml-body')
const bodyParser = require('koa-bodyparser')
const path = require('path');
const nunjucks = require('koa-nunjucks-2')
const staticFiles = require('koa-static')
const db = require('./lib/db')
const router = require('./router')
const app = new Koa()

app.use(staticFiles(path.resolve(__dirname, "web/public")))
app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'web/views'),
  nunjucksConfig: {
    trimBlocks: true
  }
}))

// 进行xml解析
app.use(xmlParser())
// 进行requestbody解析
app.use(bodyParser())
// 连接mongodb
// db(app)
// 加入路由
app.use(router.routes(), router.allowedMethods())

app.listen(3005)