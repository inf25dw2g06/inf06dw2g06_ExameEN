const usersService = require("../usersService");

async function getUsers(req, res) {
    const list = await usersService.getAll();
    res.json(list);
}

module.exports = { getUsers };