const { Schema, model } = require("mongoose");
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

const UserModel = model("User", userSchema);
module.exports = UserModel;