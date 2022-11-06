const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const router = require('./router/router.js');
const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(router);

app.listen(3000, () => {
    console.log('server выебан on port 3000');
});