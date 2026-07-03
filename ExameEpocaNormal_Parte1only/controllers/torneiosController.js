const Torneio = require('../models/Torneio')

exports.getTorneios = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    const torneios = await Torneio.findAll({ where: { userId: req.user.id } })
    res.json(torneios)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.criarTorneio = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    const torneio = await Torneio.create({ ...req.body, userId: req.user.id })
    res.status(201).json(torneio)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.atualizarTorneio = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    const torneio = await Torneio.update(req.body, {
      where: { id: req.params.id, userId: req.user.id }
    })
    res.json({ mensagem: 'Torneio Atualizado', torneio })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.apagarTorneio = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    await Torneio.destroy({ where: { id: req.params.id, userId: req.user.id } })
    res.json({ mensagem: 'Torneio eliminado' })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}