function getProtected(req, res) {
  console.log('Utilizador autenticado:', req.user)
  res.send('This resource access is authenticated!')
}

module.exports = { getProtected }