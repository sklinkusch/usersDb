const { Schema, model } = require("mongoose");

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

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
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
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