const { mongoose } = require('../conn')

const usersSchema = new mongoose.Schema({
  openid: {
    type: String,
    index: true,        // 因为需要按照OpenId查询用户，所以建立索引
    unique: true        // openid唯一约束
  },
  session_key: {
    type: String
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  nickName: {
    type: String,
    index: true
  },
  avatarUrl: {
    type: String
  }
})

const Users = mongoose.model('Users', usersSchema)
module.exports = Users