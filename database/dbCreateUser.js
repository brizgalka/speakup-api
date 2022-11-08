const Database = require("./database.js")

module.exports = function dbCreateUser(username, email, hashPassword, saltPassword, nickname, avatar) {

    Database.query(`
        INSERT INTO users (username,email,hashPassword,saltPassword,nickname,avatar) VALUES (?,?,?,?,?,?)`
        ,[username,email,hashPassword,saltPassword,nickname,avatar],(result) => {
            return result
        }).then()

}