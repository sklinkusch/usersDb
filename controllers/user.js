const faker = require("faker");
const UserModel = require("../models/user");

module.exports = {
    /* Create fake users */
    create: (amount = 5) =>
        new Array(amount).fill(0).map(() => ({
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            password: faker.internet.password(),
            tokens: [],
            email: faker.internet.email(),
            age: Math.floor(Math.random() * 70 + 18),
            username: faker.internet.userName(),
            short_bio: faker.lorem.text(),
            address: {
                street: faker.address.streetName(),
                street_number: Math.floor(Math.random() * 7000 + 0),
                zip: faker.address.zipCode(),
                city: faker.address.city(),
                country: faker.address.country(),
                state: faker.address.state()
            },
            phone_number: faker.phone.phoneNumber()
        })),
    /* Manage a user - insert/delete */
    manage: async (req, res) => {
        const user = {

            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            age: req.body.age,
            username: req.body.username,
            short_bio: req.body.short_bio,
            password: req.body.password,
            tokens: [],
            address: {
                street: req.body.street,
                street_number: req.body.street_number,
                zip: req.body.zip,
                city: req.body.city,
                country: req.body.country,
                state: req.body.state
            },
            phone_number: req.params.phone_number

        }

        if (req.body._id) { //req.params.userId
            console.log("It's an update")
            /* User exists it's an update */

            /* Validator for Updates https://mongoosejs.com/docs/validation.html#update-validators */

            const updateUser = await UserModel.updateOne({ _id: req.body._id }, { $set: user }, { runValidators: true })
                .then(() => {
                    console.log(`User successfully updated!`)
                    res.redirect(`/?status=success&msg='User successfully updated!'`);
                })
                .catch(err => {
                    console.error(err)
                    res.redirect(`/?status=danger&msg='${err}'`);
                })
        }
        else {
            console.log("It's a new insert")
            /* A new user will be created */
            const newUser = await new UserModel(user)
                .save()
                .then((user) => {
                    return user.generateAuthToken();
                }).then((user) => {
                    console.log(`User successfully created!`)
                    res.header('x-auth', user.tokens[0].token);
                    res.send(user);
                    // res.redirect(`/?status=success&msg='User successfully created!'`);
                })
                .catch(err => {
                    console.error(err)
                    res.redirect(`/?status=danger&msg='${err}'`);
                })
        }

    },
    /* Delete a user */
    delete: async (req, res) => {
        const user = await UserModel.findById(req.params.userId)
        console.log(user)

        const deleteUser = await UserModel.deleteOne({ _id: req.params.userId })
            .then(() => {
                console.log(`User successfully deleted!`)
                res.redirect(`/?status=success&msg='User successfully deleted!'`);
            })
            .catch(err => {
                console.error(err)
                res.redirect(`/?status=danger&msg='${err}'`);
            })

    }
}