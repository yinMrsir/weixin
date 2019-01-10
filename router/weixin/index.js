const getSha1 = require('../../common/crypto').getSha1
const { getAccessToken, getTicket } = require('../../common/wx/index')
const Router = require('koa-router')
const sign = require('../../common/wx/sign.js');
const weixin = new Router()
const Config = require('../../config')
const { msg, setMenu } = require('../../service/wxService')

weixin.get('/', async (ctx) => {
    let data = checkSignature(ctx)
    ctx.body = data || false
  })
  /**
   * 监听公众号收到的消息
   */
  .post('/', async (ctx) => {
    let data = checkSignature(ctx)
    if (data) {
      let accessToken = await getAccessToken(ctx)
      let json = ctx.request.body
      const content = await msg(json, accessToken)
      ctx.body = content
    }
  })
  /**
   * 生成SDK config配置
   */
  .get('/config', async (ctx) => {
    const query = ctx.query
    const accessToken = await getAccessToken(ctx)
    const tickets = await getTicket(accessToken, ctx)
    const _tickets = JSON.parse(tickets)
    let data = sign(_tickets.ticket, query.url)
    data.appid = Config.wxAppid
    ctx.body = data
  })
  .get('/setMenu', async (ctx) => {
    let accessToken = await getAccessToken(ctx)
    let obj = {
      "button":[
        {
          "type":"view",
          "name":"测试分享",
          "url":"http://wx.yinchunyu.com"
        },
        {
          "name":"菜单",
          "sub_button":[
            {
              "type":"view",
              "name":"旅游",
              "url":"http://www.ctrip.com/?AllianceID=1023584&sid=1626853&ouid=&app=0101F00"
            }
          ]
        }
      ]
    }
    let data = await setMenu(accessToken, JSON.stringify(obj))
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