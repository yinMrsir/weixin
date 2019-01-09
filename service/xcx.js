const request = require('request')
const Config = require('../config')
const { getByOpenId, addUser, updateUser } = require('../lib/users')
const { encode } = require('../common/genslogin')

// 获取到 openid 和 session_key
async function jscode2session(code) {
  return new Promise((res, rej) => {
    request(`https://api.weixin.qq.com/sns/jscode2session?appid=${Config.appid}&secret=${Config.appsecret}&js_code=${code}&grant_type=authorization_code`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let obj = JSON.parse(body)
        res(obj)
      } else {
        res(false)
      }
    })
  })
}

async function wxlogin(userInfo, code) {
  const data = await jscode2session(code)  // 通过code 获取到 openid 和 session_key
  let obj = Object.assign(userInfo, data)
  console.log(obj)
  let {session_key, nickName, openid, avatarUrl} = obj
  // 如果用户表中存在当前openid查询用户数据 并更新最后登录时间
  let user = await getByOpenId(openid)
  if (user.length > 0) {
    user = user[0]
    await updateUser(user._id, {lastLogin: Date.now(), session_key: session_key})
  } else {                          // 否则插入新的用户数据
    user = await addUser({
      session_key,
      nickName,
      openid,
      avatarUrl,
      lastLogin: Date.now()
    })
  }
  // 接口返回用户信息
  let result = {
    nickName: user.nickName,
    avatarUrl: user.avatarUrl,
    auth: encode(user._id),
    createTime: user.createTime
  }
  return result
}


module.exports = {
  wxlogin
}