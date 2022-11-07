const Database = require("./database.js")

export default function dbCreateUser(username,email,hashPassword,saltPassword,nickname,avatar = "standard.png") {

    Database.query(`
        INSERT INTO USERS (username,email,hashPassword,saltPassword,nickname,avatar) VALUES (?,?,?,?,?,?)`
        ,[username,email,hashPassword,saltPassword,nickname,avatar],(result) => {
            return result
        }).then(r => console.log(r))

}