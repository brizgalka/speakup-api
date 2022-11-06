const router = require('express').Router();

router.post('/login', (req, res) => {
    res.send(req.body.name)
});

router.get('/', (req, res) => {
    res.send('Under construction.')
});

router.get('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;