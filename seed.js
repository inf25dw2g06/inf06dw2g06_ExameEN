const sequelize = require('./config/database')
const Torneio = require('./models/Torneio')
const Equipa = require('./models/Equipa')
const User = require('./models/User')

async function seed() {
  await sequelize.sync({ force: true })

  const user1 = await User.create({ username: 'admin', password: 'password123' })
  const user2 = await User.create({ username: 'jogador1', password: 'pass456' })
  const user3 = await User.create({ username: 'jogador2', password: 'pass789' })

  const jogos = ['FIFA 25', 'Rocket League', 'Valorant', 'CS2', 'League of Legends']

  for (let i = 1; i <= 20; i++) {
    const torneio = await Torneio.create({
      nome: `Torneio ${i}`,
      jogo: jogos[i % jogos.length],
      userId: user1.id
    })
    await Equipa.create({ nome: `Equipa Alpha ${i}`, numeroJogadores: 5, TorneioId: torneio.id })
    await Equipa.create({ nome: `Equipa Beta ${i}`,  numeroJogadores: 5, TorneioId: torneio.id })
  }

  for (let i = 1; i <= 5; i++) {
    const torneio = await Torneio.create({
      nome: `Torneio Jogador1 ${i}`,
      jogo: jogos[i % jogos.length],
      userId: user2.id
    })
    await Equipa.create({ nome: `Equipa J1 ${i}`, numeroJogadores: 3, TorneioId: torneio.id })
  }

  for (let i = 1; i <= 5; i++) {
    const torneio = await Torneio.create({
      nome: `Torneio Jogador2 ${i}`,
      jogo: jogos[i % jogos.length],
      userId: user3.id
    })
    await Equipa.create({ nome: `Equipa J2 ${i}`, numeroJogadores: 4, TorneioId: torneio.id })
  }

  console.log('Seed completo: 3 users, 30 torneios, 50 equipas')
  process.exit()
}

seed()