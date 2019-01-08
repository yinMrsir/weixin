const crypto = require('crypto')
const secret = 'weixin-2019-01'
const algorithm = 'aes256'

function encode (id) {
  const encoder = crypto.createCipher(algorithm, secret);
  const str = [id, Date.now(), 'weixin2019'].join('|')
  let encrypted = encoder.update(str, 'utf8', 'hex')
  encrypted += encoder.final('hex')
  return encrypted
}

function decode(str) {
  const decoder = crypto.createDecipher(algorithm, secret)
  let decoded = decoder.update(str, 'hex', 'utf8')
  decoded += decoder.final('utf8')
  const arr = decoded.split('|')
  return {
    id: arr[0],
    timespan: parseInt(arr[1])
  }
}

module.exports = {
  encode,
  decode
}