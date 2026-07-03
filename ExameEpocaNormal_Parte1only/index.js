const express = require('express')
const cors = require('cors')
const sequelize = require('./config/database')

const usersController = require('./controllers/usersController')
const authController = require('./controllers/authController')
const protectedController = require('./controllers/protectedController')
const { setupSwagger } = require('./controllers/swaggerController')
const torneiosController = require('./controllers/torneiosController')
const equipasController = require('./controllers/equipasController')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

setupSwagger(app, port)

// Users
app.get('/users', usersController.getUsers)

// Protected
app.get('/protected', authController.auth, protectedController.getProtected)

// Auth
app.post('/auth/token', authController.login)

// Torneios
app.get('/torneios', authController.auth, torneiosController.getTorneios)
app.post('/torneios', authController.auth, torneiosController.criarTorneio)
app.put('/torneios/:id', authController.auth, torneiosController.atualizarTorneio)
app.delete('/torneios/:id', authController.auth, torneiosController.apagarTorneio)

// Equipas (aninhadas nos torneios — relação 1:N bem visível na URL)
app.get('/torneios/:torneioId/equipas', authController.auth, equipasController.getEquipasPorTorneio)
app.post('/torneios/:torneioId/equipas', authController.auth, equipasController.criarEquipa)
app.put('/torneios/:torneioId/equipas/:id', authController.auth, equipasController.atualizarEquipa)
app.delete('/torneios/:torneioId/equipas/:id', authController.auth, equipasController.apagarEquipa)

sequelize.sync().then(() => {
  console.log('Base de dados carregada')
  app.listen(port, () => {
    console.log(`Servidor na porta ${port}`)
  })
}).catch(err => console.log('erro', err))