const express = require('express')
const cors = require('cors')
const sequelize = require('./config/database')

const usersController = require('./controllers/usersController')
const authController = require('./controllers/authController')
const protectedController = require('./controllers/protectedController')
const swaggerController = require('./controllers/swaggerController')
const torneiosController = require('./controllers/torneiosController')

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

swaggerController(app)

app.get('/users', usersController.getUsers)
app.get('/protected', authController.auth, protectedController.getProtected)

app.get('/torneios', torneiosController.getTorneios)
app.post('/torneios', authController.auth, torneiosController.criarTorneio)

sequelize.sync().then(() => {
  console.log('Base de dados trancada e carregada')
  app.listen(port, () => {
    console.log(`Servidor a rasgar asfalto na porta ${port}`)
  })
}).catch(err => console.log('O motor gripou', err))