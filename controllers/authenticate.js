const UserModel = require('../models/user');
const bcrypt = require('bcrypt');


module.exports = {
    /**Authentication method -> check if user exists with this token */
    authenticate: (req, res, next) => {

        if (req && req.cookies['x-auth']) {

            const token = req.cookies['x-auth']
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
        } else {
            res.json({ 'error': 'No JWT No Party' })
        }

    },

    login: (req, res) => {
        console.log(`Form received ${req.body.email}`)

        // Retrieve from Mongo if a user with this email exists
        UserModel.findOne({ email: req.body.email }, async (err, user) => {
            if (err) throw err;

            if (!user) {
                res.json({
                    success: false,
                    message: "Auth failed: no user"
                })
            } else {
                // when I got the user I'll check if the submitted pwd is the same I have in the DB

                //if (user.password != req.body.password) {

                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    // nope
                    res.json({
                        success: false,
                        message: "Auth failed: password wrong"
                    })
                } else {
                    // yep
                    // res.json({
                    //     success: true,
                    //     message: "Auth Ok!"
                    // })

                    //TODO: Implement robust auth with encrypted password !!! plis
                    console.log("Now I create the token")
                    //JWT token creation

                    const authUser = new UserModel(user)

                    const userToken = await authUser.generateAuthToken()
                    const token = await userToken.tokens[0].token

                    res.cookie('x-auth', token);
                    res.cookie('loggedUser', user.username);
                    res.redirect('/')

                }



            }
        })



        // if all good I'll create a new token for this user



    }

}




