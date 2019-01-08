/**
 * 获取微信运动步数解密
 * var pc = new WXBizDataCrypt(appid, sessionKey)
   var data = pc.decryptData(encryptedData, decodeURIComponent(iv))
   data: 解密后的数据
 */
var crypto = require('crypto')

function WXBizDataCrypt(appId, sessionKey) {
  this.appId = appId
  this.sessionKey = sessionKey
}

WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
  // base64 decode
  var sessionKey = new Buffer(this.sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')

  try {
     // 解密
    var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true)
    var decoded = decipher.update(encryptedData, 'binary', 'utf8')
    decoded += decipher.final('utf8')
    
    decoded = JSON.parse(decoded)

  } catch (err) {
    return {
      code: 202,
      message: '解密错误'
    }
  }

  if (decoded.watermark.appid !== this.appId) {
    return {
      code: 202,
      message: 'appid有误'
    }
  }

  return decoded
}

module.exports = WXBizDataCrypt
