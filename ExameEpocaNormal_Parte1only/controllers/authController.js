const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ erro: 'Dados em falta' })

    const user = await User.findOne({ where: { username } })

    
    if (!user || user.password !== password) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'chave_secreta_default', 
      { expiresIn: '2h' }
    )

    return res.json({ access_token: token, token_type: 'Bearer' })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Token não fornecido ou formato incorreto' })
  }
  
  const token = authHeader.split(' ')[1]
  
  jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_default', (err, decoded) => {
    if (err) return res.status(403).json({ erro: 'Token inválido' })
    req.user = decoded
    next()
  })
}