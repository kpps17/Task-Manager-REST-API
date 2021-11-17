const jwt = require('jsonwebtoken');
const { user } = require('../models/user');
const { JWT_KEY } = require('../secrets');

async function authHelper (req, res, next) {
    try {
        if(req.cookies.login) {
            let tokenToBeVerifed = req.cookies.login;
            let data = jwt.verify(tokenToBeVerifed, JWT_KEY);
            let client = await user.findOne({'tokens.token': tokenToBeVerifed});
            if(!client) {
                return res.json({
                    message: "First Authenticate",
                })
            } 
            req.token = tokenToBeVerifed;
            req.client = client;
            // console.log(client);
            next();
        }
    } catch (err) {
        return res.json({
            message: err.message,
        })
    }
}

module.exports = { authHelper };
