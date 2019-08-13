const UserModel = require('../models/user')

/**Authentication method -> check if user exists with this token */
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    console.log(`token is ${token}`)

    UserModel.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        req.user = user
        req.token = token
        next();
    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = { authenticate };