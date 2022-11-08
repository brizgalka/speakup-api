const createUser = require('../models/createUser.js')

module.exports = (req, res) => {
    try {
        createUser(
                req.body.username, 
                req.body.email, 
                req.body.password, 
                req.body.nickname || req.body.username, 
                req.body.avatar || 'standard.png'
        )
        res.sendStatus(200)
    } catch(e) {
        console.log(e)
        res.sendStatus(500)
    }
}