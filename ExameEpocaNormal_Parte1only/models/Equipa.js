const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')
const Torneio = require('./Torneio')

const Equipa = sequelize.define('Equipa', {
  nome: { type: DataTypes.STRING, allowNull: false },
  numeroJogadores: { type: DataTypes.INTEGER, allowNull: false }
})

// 1:N
Torneio.hasMany(Equipa)
Equipa.belongsTo(Torneio)

module.exports = Equipa