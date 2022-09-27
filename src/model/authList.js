const mongoose = require("mongoose");

const userList = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      fname: {
        type: String,
        required: [true, "First name is required"],
      },
      lname: {
        type: String,
        required: [true, "Last name is required"],
      },
      type: {
        type: String,
        required: [true, "User type is required"],
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
      },
    },
    { timestamps: true }
  )
);

module.exports = userList;
