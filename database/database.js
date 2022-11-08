const mysql = require('mysql');

module.exports = class Database {

    static connection = null;

    static createConnection = async (host, user, password, database) => {
        this.connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });
        await this.connection.connect(function (err) {
            if (err) throw err;
            console.log("Подключено!");
        });
    }

    static endConnection = async () => {
        if (this.connection != null) {
            await this.connection.end();
        } else {
            console.log("no connection")
        }
    }

    static query = async (sql, args, onResult) => {
        if(this.connection != null) {
            await this.connection.query(sql, args, function (err, result, fields) {
                if (err) throw err;
                onResult(result[0])
            });
        }
    }

}