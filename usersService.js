const users = [
    { id: 1, username: 'basicUser', password: 'basicPassword', firstName: 'Basic', lastName: 'User' },
    { id: 2, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }
];

module.exports = { authenticate, getAll };

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return true;
    }
    return false;
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}