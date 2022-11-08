const dbCreateUser = require("../database/dbCreateUser.js");
const cryptor = require('../utils/cryptor.js')

module.exports = function createUser(username, email, password, nickname, avatar) {

    try {
        const saltPassword = cryptor.genSalt();
        const hashPassword = cryptor.hashPassword(password, saltPassword).hash;
        dbCreateUser(username, email, hashPassword, saltPassword, nickname, avatar).then();
    } catch (e) {
        console.log(e)
        return False
    }

}