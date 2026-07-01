const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

function setupSwagger(app, port) {
    const swaggerDefinition = {
        openapi: "3.0.0",
        info: {
            title: "Torneios_Auth",
            version: "1.0.0",
            description: "Exemplo 01 for Basic Authentication",
            contact: { name: "O teu nome" },
        },
        servers: [ { url: "http://localhost:" + port } ],
        components: {
            securitySchemes: {
                basicAuth: { type: "http", scheme: "basic" },
            },
        },
        security: [{ basicAuth: [] }],
    };

    const options = {
        swaggerDefinition,
        apis: ["./docs/**/*.yaml"],
    };

    const swaggerSpec = swaggerJSDoc(options);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger };