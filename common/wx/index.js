const request = require('request')
const fs = require('fs')
const Config = require('../../config/index')

/**
 * 获取access_token
 * @returns {Promise<any>}
 */
async function getAccessToken() {
  const data = await readFile('accesstoken')
  let currTime = new Date().getTime()
  if (!data || (parseInt(currTime) - parseInt(data.createTime)) >= data.expires_in) {    // 没有文件或者已过期
    return new Promise((res, rej) => {
      request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${Config.wxAppid}&secret=${Config.wxAppsecret}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let obj = {createTime: currTime}
          obj = Object.assign(obj, JSON.parse(body))
          writeFile(JSON.stringify(obj), 'accesstoken')
          res(obj)
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
async function getTicket(accessToken) {
  const data = await readFile('ticket')
  let currTime = new Date().getTime()
  if (!data || (parseInt(currTime) - parseInt(data.createTime)) >= data.expires_in) {    // 没有文件或者已过期
    return new Promise((res, rej) => {
      request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let obj = {createTime: currTime}
          obj = Object.assign(obj, JSON.parse(body))
          writeFile(JSON.stringify(obj),'ticket')
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



/**
 * 写入accesstoke文件
 * @param str 写入文件的数据
 * @returns {Promise<any>}
 */
async function writeFile(str, textName) {
  return new Promise((res, rej) => {
    fs.writeFile(`${process.cwd()}/tmpfile/wx/${textName}.txt`, str, err => {
      if (!err) {
        res(true)
      } else {
        res(false)
      }
    })
  })
}

/**
 * 读取文件的数据
 * @returns {Promise<any>}
 */
async function readFile(textName) {
  return new Promise((res, rej) => {
    fs.readFile(`${process.cwd()}/tmpfile/wx/${textName}.txt`, 'utf-8', function(err, data) {
      if (!err) {
        res(JSON.parse(data))
      } else {
        res(false)
      }
    })
  })
}

module.exports = {
  getAccessToken,
  getTicket
}
