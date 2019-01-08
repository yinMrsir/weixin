const mongoose = require('mongoose')
async function connect () {
    await mongoose.connect('mongodb://localhost/weixin', {useNewUrlParser:true})
}

async function close () {
  await mongoose.connection.close()
}
module.exports = {
  mongoose,
  connect,
  close
}
