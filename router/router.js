const router = require('express').Router();
const register = require('./register.js')

router.post('/account/login', (req, res) => {
    register(req, res);
});

router.post('/account/register', (req, res) => {
    register(req, res);
})

router.get('/', (req, res) => {
    res.send('Under construction.')
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;