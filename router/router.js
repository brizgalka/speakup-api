const router = require('express').Router();

router.post('/account/login', (req, res) => {
    res.send(req.body)
});

router.post('/account/register', (req, res) => {
    res.send(req.body);
})

router.get('/', (req, res) => {
    res.send('Under construction.')
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;