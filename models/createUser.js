const Database = require('../database/database.js')
const dbCreateUser = require("../database/dbCreateUser");

module.exports = function createUser(username,email,hashPassword,saltPassword,nickname,avatar = "standard.png") {

    dbCreateUser(username,email,hashPassword,saltPassword,nickname,avatar).then()

}