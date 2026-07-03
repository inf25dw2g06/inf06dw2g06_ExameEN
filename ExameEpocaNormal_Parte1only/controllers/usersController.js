const User = require('../models/User')

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'createdAt'] 
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

module.exports = { getUsers }