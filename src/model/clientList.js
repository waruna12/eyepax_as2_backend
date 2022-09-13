const mongoose = require("mongoose");

const clientList = mongoose.model(
  "client",
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
      phone_number: {
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

module.exports = clientList;
