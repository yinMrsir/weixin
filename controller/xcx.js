const { wxlogin } = require('../service/xcx')
const WXBizDataCrypt = require('../common/xcx/WXBizDataCrypt')
const Config = require('../config')
const { getById } = require('../lib/users')
const { decode } = require('../common/genslogin')

module.exports = {
  /**
   * 小程序登录
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  login: async (ctx, next) => {
    let body = ctx.request.body
    let jsonDataType = Object.prototype.toString.call(body.jsonData)
    let userInfo = null
    if (jsonDataType === '[object Object]') {
      userInfo = body.jsonData.userInfo
    } else if(jsonDataType === '[object String]'){
      userInfo = JSON.parse(body.jsonData).userInfo
    }
    let Result = await wxlogin(userInfo, body.code)
    ctx.body = {
      code: 200,
      Result
    }
  },
  /**
   * 获取步数
   * @param ctx
   * @param next
   * @returns {Promise<void>}
   */
  weRunData: async (ctx, next) => {
    let auth = ctx.get('Auth')
    if (!auth || auth === '[object Undefined]' || toString.call(auth) !== '[object String]') {
      ctx.body = {
        code: 551,
        errMessage: '用户未登录'
      }
    } else {
      auth = decode(auth)
      let {id, timespan} = auth
      let body = ctx.request.body
      let {encryptedData, iv} = body
      let userData = await getById(id)
      let pc = new WXBizDataCrypt(Config.appid, userData.session_key)
      let Result = pc.decryptData(encryptedData, decodeURIComponent(iv))
      ctx.body = Result
    }
  }
}