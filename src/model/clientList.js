const mongoose = require("mongoose");

const clientList = mongoose.model(
  "client",
  new mongoose.Schema(
    {
      //table name"client"
      fname: {
        type: String,
        required: [true, "First name is required "],
      },
      lname: {
        type: String,
        required: [true, "Last name is required "],
      },
      phone_number: {
        type: String,
        required: [true, "Phone number is required "],
      },
      email: {
        type: String,
        required: [true, "Email is required "],
        index: {
          unique: true,
        },
      },
    },
    { timestamps: true }
  )
);

module.exports = clientList;
