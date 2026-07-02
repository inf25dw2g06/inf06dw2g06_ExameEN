// models/Torneio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Torneio = sequelize.define('Torneio', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jogo: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Torneio;