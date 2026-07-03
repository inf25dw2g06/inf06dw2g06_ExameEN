const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

function setupSwagger(app, port) {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Torneios API',
      version: '1.0.0',
      description: 'API REST para gestão de torneios de videojogos',
      contact: { name: 'rafael' }
    },
    servers: [{ url: 'http://localhost:' + port }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Torneio: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            jogo: { type: 'string' },
            userId: { type: 'integer' }
          }
        },
        Equipa: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            numeroJogadores: { type: 'integer' },
            TorneioId: { type: 'integer' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            createdAt: { type: 'string' }
          }
        }
      }
    }
  }

  const options = {
    swaggerDefinition,
    apis: ['./docs/**/*.yaml']
  }

  const swaggerSpec = swaggerJSDoc(options)
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

module.exports = { setupSwagger }