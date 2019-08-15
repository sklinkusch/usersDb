const { Schema, model } = require("mongoose");
const jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* Validation for the email - extension 2 to 6 chars*/
const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
  return re.test(email)
};

/* User schema */
const userSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      required: 'Email address is required',
      validate: [validateEmail, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }],
    age: Number,
    username: String,
    short_bio: String,
    address: {
      street: String,
      street_number: String,
      zip: String,
      state: String,
      city: String,
      country: String
    },
    phone_number: String
  },
  { strict: "throw", timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'iAmVerySecret').toString();

  // user.tokens = user.tokens.concat([{access, token}])
  user.tokens.push({ access, token });
  return user.save().then(() => {
    return user;
  });
}

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'iAmVerySecret')
  } catch (e) {
    console.log(e)
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}


const UserModel = model("User", userSchema);
module.exports = UserModel;