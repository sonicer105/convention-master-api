const jwt = require('jsonwebtoken');
const globals = require("../server")

function generateAccessToken(user) {
    return jwt.sign(user, globals.secret, {expiresIn: "1800s"});
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, globals.secret, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

module.exports = {
    generateAccessToken: generateAccessToken,
    authenticateToken: authenticateToken
}