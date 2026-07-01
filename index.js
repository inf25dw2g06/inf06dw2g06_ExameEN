const express = require("express");
const cors = require("cors");
const swaggerController = require("./controllers/swaggerController");
const authController = require("./controllers/authController");
const usersController = require("./controllers/usersController");
const protectedController = require("./controllers/protectedController");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

swaggerController.setupSwagger(app, port);

app.get("/users", usersController.getUsers);
app.get("/protected", authController.auth, protectedController.getProtected);

app.listen(port, function () {
    console.log(`app running on localhost:${port}`);
});