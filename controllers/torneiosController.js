const Torneio = require('../models/Torneio');

exports.getTorneios = async (req, res) => {
  try {
    const torneios = await Torneio.findAll();
    res.json(torneios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criarTorneio = async (req, res) => {
  try {
    const torneio = await Torneio.create(req.body);
    res.status(201).json(torneio);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
};