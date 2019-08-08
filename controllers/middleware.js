/* Express and Handlebars template engine - Views */
const path = require('path');
const express = require('express')
const exphbs = require('express-handlebars');
const UserModel = require("../models/user");

const User = require("./user")

/* Express routing */
exports.run = async () => {

    const app = express()

    /* 
    Use an Express Template https://expressjs.com/en/guide/using-template-engines.html 
    Handlebars View Engine https://github.com/ericf/express-handlebars 
    */

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    //req.body

    app.use('/static', express.static(path.join(__dirname, '../views/static')))

    app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

    /* Home route */
    app.get('/', async (req, res) => {
        const users = await UserModel.find({})
        // console.log(users);

        const { status, msg } = req.query;
        res.render('home', { users, title: "Homepage", status, msg })
    })

    /* View single user route */
    app.get('/users/view/:userId', async (req, res) => {
        const user = await UserModel.findById(req.params.userId)
        console.log(user);

        res.render('user', { user, title: "View user's details" })
    })

    /* Add user form */
    app.get('/users/add', async (req, res) => {
        res.render('form', { title: "Insert a new user in the database" })
    })

    /* Insert user with post data */
    app.post('/users/add', User.manage)

    /* Edit user overview */
    app.get('/users/edit/', async (req, res) => {
        const users = await UserModel.find({});
        res.render('home', { users, edit: true, title: "Update a users infos" })
    })

    /* Edit user by id */
    app.get('/users/edit/:userId', async (req, res) => {
        const user = await UserModel.findById(req.params.userId)
        res.render('form', { user, update: true, title: "Update a user in the database" })
    })

    /* Update user with post data */
    app.post('/users/edit/:userId', User.manage)

    /* Delete user */
    app.get('/users/del/:userId', User.delete)

    /* Search by age greater then */
    app.get('/search/age/:age', async (req, res) => {
        const users = await UserModel.find({ age: { $gte: req.params.age } })

        const empty = users.length <= 0 ? true : false;

        res.render('home',
            { /* Variables we pass to the view engine */
                users: users, title: `Search by age greater than ${req.params.age}`,
                search: true,
                empty
            }
        )
    })

    /* Rest API example */
    app.get('/api/', async (req, res) => {
        const users = await UserModel.find({}).exec({})
        console.log(users);
        return res.json(users);
    })

    console.log(`View user data on http://localhost:3000`);
    await app.listen(3000)
}