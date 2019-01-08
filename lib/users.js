const Users = require('./model/users')

/**
 * 通过openid查询
 * @param openid
 * @returns {Promise<*>}
 */
async function getByOpenId(openid) {
  return await Users.find({openid: openid})
}

/**
 * 通过ID获取数据
 * @param id
 * @returns {Promise<*>}
 */
async function getById(id) {
  return await Users.findById(id)
}

/**
 * 插入新的用户数据
 * @param user
 * @returns {Promise<*>}
 */
async function addUser(user) {
  const {
    openid,
    nickName,
    session_key,
    avatarUrl
  } = user
  return await Users.create(user)
}

/**
 * 更新用户数据
 * @param id
 * @param params
 * @returns {Promise<*>}
 */
async function updateUser(id, params) {
  return await Users.update({
    _id: id
  }, params)
}

module.exports = {
  getById,
  getByOpenId,
  addUser,
  updateUser
}