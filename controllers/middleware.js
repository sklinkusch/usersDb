/* Express and Handlebars template engine - Views */
const path = require('path');
const express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const UserModel = require("../models/user");

const User = require("./user")

/* Express routing */
exports.run = async () => {

    const app = express()

    /* 
    Use an Express Template https://expressjs.com/en/guide/using-template-engines.html 
    Handlebars View Engine https://github.com/ericf/express-handlebars 
    */

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

    app.get('/', async (req, res) => {
        const users = await UserModel.find({}).exec({})
        // console.log(users);
        const { status, msg } = req.query;
        res.render('home', { users, title: "Homepage", status, msg })
    })

    app.get('/api/', async (req, res) => {
        const users = await UserModel.find({}).exec({})
        console.log(users);
        return res.send(users);
    })

    app.get('/user/:userId', async (req, res) => {
        const user = await UserModel.findById(req.params.userId).exec({})
        console.log(user);
        res.render('user', { user: user, title: "User Info" })
    })

    app.get('/search/age/:age', async (req, res) => {
        const users = await UserModel.find({ age: { $gte: req.params.age } }).exec({})
        console.log(users);
        res.render('home',
            { /* Variables we pass to the view engine */
                users: users, title: `Search by Age greater than ${req.params.age}`,
                search: true
            }
        )
    })

    app.get('/users/add', async (req, res) => {
        res.render('add', { title: "Add User Info" })
    })

    app.post('/users/add', User.addUser)

    console.log(`View user data on http://localhost:3000`);
    await app.listen(3000)
}