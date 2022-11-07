const mysql = require('mysql');

class Database {

    constructor(host, user, password) {
        const conn = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: 'speakup'
        });
    }



}

module.exports = Database