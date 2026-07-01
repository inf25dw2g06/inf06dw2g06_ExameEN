const basicAuth = require("basic-auth");
const usersService = require("../usersService");

async function auth(req, res, next) {
    const user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
        return;
    }
    
    const authenticated = await usersService.authenticate({ username: user.name, password: user.pass });
    if (authenticated) {
        next();
    } else {
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
        return;
    }
}

module.exports = { auth };