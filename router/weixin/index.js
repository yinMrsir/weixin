const getSha1 = require('../../common/crypto').getSha1
const { getAccessToken, getTicket } = require('../../common/wx/index')
const Router = require('koa-router')
const sign = require('../../common/wx/sign.js');
const weixin = new Router()
const Config = require('../../config')
const { msg, setMenu } = require('../../service/wxService')

weixin.get('/', async (ctx) => {
    let data = checkSignature(ctx)
    if (data) {
      let accessTokenData = await getAccessToken()
      let obj = {
        "button":[
          {
            "type":"click",
            "name":"今日歌曲",
            "key":"V1001_TODAY_MUSIC" },
          {     "name":"菜单",
            "sub_button":[
              {
                "type":"view",
                "name":"搜索",
                "url":"http://www.soso.com/"},
              {
                "type":"miniprogram",
                "name":"wxa",
                "url":"http://mp.weixin.qq.com",
                "appid":"wx286b93c14bbf93aa",
                "pagepath":"pages/lunar/index"
              },
              {
                "type":"click",
                "name":"赞一下我们",
                "key":"V1001_GOOD"
              }]
          }],
        "matchrule":{
          "tag_id":"2",
          "sex":"1",
          "country":"中国",
          "province":"广东",
          "city":"广州",
          "client_platform_type":"2",
          "language":"zh_CN"
        }
      }
      await setMenu(accessTokenData, obj)
    }
    ctx.body = data || false
  })
  /**
   * 监听公众号收到的消息
   */
  .post('/', async (ctx) => {
    let data = checkSignature(ctx)
    if (data) {
      let accessTokenData = await getAccessToken()
      let json = ctx.request.body
      const content = await msg(json, accessTokenData)
      ctx.body = content
    }
  })
  /**
   * 生成SDK config配置
   */
  .get('/config', async (ctx) => {
    const query = ctx.query
    const accessToken = await getAccessToken()
    const tickets = await getTicket(accessToken.access_token)
    const _tickets = JSON.parse(tickets)
    let data = sign(_tickets.ticket, query.url)
    data.appid = Config.wxAppid
    ctx.body = data
  })

/**
 * 检测是否为微信 发送的消息
 * @param ctx
 * @returns {*}
 */
function checkSignature(ctx) {
  let query = ctx.query
  // 将token、timestamp、nonce三个参数进行字典序排序
  const params = ['weixin', query.timestamp, query.nonce]
  params.sort()
  // 将三个参数字符串拼接成一个字符串
  let str = params.join('')
  // 获得加密后的字符串可与signature对比
  if (query.signature === getSha1(str)) {
    return query.echostr || true
  }else {
    return false
  }
}

module.exports = weixin