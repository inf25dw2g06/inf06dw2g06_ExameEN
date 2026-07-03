const Equipa = require('../models/Equipa')
const Torneio = require('../models/Torneio')

exports.getEquipas = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    // só devolve equipas de torneios do utilizador autenticado
    const torneios = await Torneio.findAll({ where: { userId: req.user.id } })
    const torneioIds = torneios.map(t => t.id)
    const equipas = await Equipa.findAll({ where: { TorneioId: torneioIds } })
    res.json(equipas)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.getEquipasPorTorneio = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    // verifica que o torneio pertence ao utilizador
    const torneio = await Torneio.findOne({
      where: { id: req.params.torneioId, userId: req.user.id }
    })
    if (!torneio) return res.status(404).json({ erro: 'Torneio não encontrado ou sem permissão' })

    const equipas = await Equipa.findAll({ where: { TorneioId: req.params.torneioId } })
    res.json(equipas)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.criarEquipa = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    const torneio = await Torneio.findOne({
      where: { id: req.params.torneioId, userId: req.user.id }
    })
    if (!torneio) return res.status(404).json({ erro: 'Torneio não encontrado ou sem permissão' })

    const equipa = await Equipa.create({
      ...req.body,
      TorneioId: req.params.torneioId
    })
    res.status(201).json(equipa)
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.atualizarEquipa = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    const torneio = await Torneio.findOne({
      where: { id: req.params.torneioId, userId: req.user.id }
    })
    if (!torneio) return res.status(404).json({ erro: 'Torneio não encontrado ou sem permissão' })

    await Equipa.update(req.body, {
      where: { id: req.params.id, TorneioId: req.params.torneioId }
    })
    res.json({ mensagem: 'Equipa atualizada' })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}

exports.apagarEquipa = async (req, res) => {
  try {
    console.log('Utilizador autenticado:', req.user)
    const torneio = await Torneio.findOne({
      where: { id: req.params.torneioId, userId: req.user.id }
    })
    if (!torneio) return res.status(404).json({ erro: 'Torneio não encontrado ou sem permissão' })

    await Equipa.destroy({
      where: { id: req.params.id, TorneioId: req.params.torneioId }
    })
    res.json({ mensagem: 'Equipa eliminada' })
  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
}