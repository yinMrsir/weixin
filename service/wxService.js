const request = require('request')
const xml2js = require('xml2js')

module.exports = {
  msg: async (json, accessTokenData) => {
    let xml = json.xml
    if (xml.MsgType.indexOf('event') > -1) {
      return await eventMsg(xml, accessTokenData)
    } else {
      return await replyMsg(xml)
    }
  },
  setMenu: async (accessTokenData, data) => {
    await setMenu(accessTokenData, data)
  }
}

/**
 * 关注
 */
async function eventMsg(xml, accessTokenData) {
  if (xml.Event.indexOf('unsubscribe') > -1) {
    return `伤心`
  } else {
    // 去除[ ]
    let openid = (''+xml.FromUserName).replace("[ '", "").replace("' ]", '')
    let userInfo = await getUserInfo(accessTokenData.access_token, openid)
    
    const builder = new xml2js.Builder()
    let content = {
      xml: {
        ToUserName: xml.FromUserName,
        FromUserName: xml.ToUserName,
        CreateTime: Date.now(),
        MsgType: 'text',
        Content: `${userInfo.nickname} 终于等到你啦！, 来来来，跟我一起嗨。你说yes, 我说no ~`
      }
    }
    content = builder.buildObject(content)
    return content
  }
}

/**
 * 消息回复
 */
async function replyMsg(xml) {
  const builder = new xml2js.Builder()
  let content = {
    xml: {
      ToUserName: xml.FromUserName,
      FromUserName: xml.ToUserName,
      CreateTime: Date.now(),
      MsgType: 'text',
      Content: textContent(xml.Content)
    }
  }
  content = builder.buildObject(content)
  return content
}

/**
 * 根据关键词 回复
 * @param content
 * @returns {string}
 */
function textContent(content) {
  if (content.indexOf('yes') > -1) {
    return 'no, no, no'
  } else if(content.indexOf('猜谜') > -1) {
    return `上边毛，下边毛，中间一粒黑葡萄，打一器官~`
  } else if(content.indexOf('眼睛') > -1) {
    return `你真的太聪明了~`
  }else {
    return `要你说yes你不说，不和你玩了~, 回复猜谜试试！`
  }
}

/**
 * 获取用户信息
 * @param accessToken
 * @param openid
 * @returns {Promise<any>}
 */
function getUserInfo(accessToken, openid) {
  return new Promise((res, rej) => {
    request(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openid}&lang=zh_CN`, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res(JSON.parse(body))
      } else {
        res(false)
      }
    })
  })
}

async function setMenu(accessToken, data) {
  return new Promise((res, rej) => {
    request({
      url: `https://api.weixin.qq.com/cgi-bin/menu/addconditional?access_token=${accessToken}`,
      method: "POST",
      body: data
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res(JSON.parse(body))
      } else {
        res(false)
      }
    })
  })
}