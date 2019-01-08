const {
  connect,
  close
} = require('./conn')

module.exports = (app) => {
  app.use(async (context, next) => {
    await connect()
    await next()
    await close()
  })
}