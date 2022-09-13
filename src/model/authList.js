const mongoose = require("mongoose");

const userList = mongoose.model(
  "user",
  new mongoose.Schema(
    {
      //table name"client"
      fname: {
        type: String,
        required: true,
      },
      lname: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = userList;
