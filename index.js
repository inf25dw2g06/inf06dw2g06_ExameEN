const express = require("express");
const cors = require("cors");
const basicAuth = require("basic-auth");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;

app.use(cors());

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Torneios_Auth",
    version: "1.0.0",
    description: "Basic Authentication",
    contact: { name: "Rafael" },
  },
  servers: [ {url: "http://localhost:" + port,} ],
  components: {
    securitySchemes: {
      basicAuth: { type: "http", scheme: "basic", },
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

function auth (req, res, next) {
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  if (user.name === "basicUser" && user.pass === "basicPassword") {
    next();
  } else {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
};

app.get("/users", function (req, res) {
  res.send("This resource access is open!");
});

app.get("/protected", auth, function (req, res) {
  res.send("This resource access is authenticated!");
});

app.listen(port, function () {
  console.log(`app running on localhost:${port}`);
});