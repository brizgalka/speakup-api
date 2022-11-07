require("dotenv").config()
const express = require('express');
const cors = require('cors');
const Database = require("./database/database.js")
const bodyParser = require('body-parser')
const router = require('./router/router.js');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME} = process.env;

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json())
app.use(router);
;
app.listen(PORT, () => {

    try {
        Database.createConnection(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME).finally(r => console.log("db has been connected"))
    } catch (e) {
        console.warn(e.toString())
    }

    console.log(`server has been started on port: ${PORT}`);
});