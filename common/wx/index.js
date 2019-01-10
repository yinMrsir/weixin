const request = require('request')
const Config = require('../../config/index')

/**
 * 获取access_token
 * @returns {Promise<any>}
 */
async function getAccessToken(ctx) {
  const data = ctx.session.wxAccesstoken ? JSON.parse(ctx.session.wxAccesstoken) : false
  let currTime = new Date().getTime()
  if (!data || (parseInt(currTime) - parseInt(data.createTime)) >= data.expires_in) {    // 没有文件或者已过期
    return new Promise((res, rej) => {
      request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Config.wxAppid}&secret=${Config.wxAppsecret}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let obj = {createTime: currTime}
          obj = Object.assign(obj, JSON.parse(body))
          ctx.session.wxAccesstoken = JSON.stringify(obj)
          res(obj.access_token)
        } else {
          res(false)
        }
      })
    })
  } else {
    return data
  }
}

/**
 * 获取getTicket
 * @param accessToken
 * @returns {Promise<*>}
 */
async function getTicket(accessToken, ctx) {
  const data = ctx.session.ticket ? JSON.parse(ctx.session.ticket) : false
  let currTime = new Date().getTime()
  if (!data || (parseInt(currTime) - parseInt(data.createTime)) >= data.expires_in) {    // 没有文件或者已过期
    return new Promise((res, rej) => {
      request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let obj = {createTime: currTime}
          obj = Object.assign(obj, JSON.parse(body))
          ctx.session.ticket = JSON.stringify(obj)
          res(body)
        } else {
          res(false)
        }
      })
    })
  } else {
    return data
  }
}

module.exports = {
  getAccessToken,
  getTicket
}
