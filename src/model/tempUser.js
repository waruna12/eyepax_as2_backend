const mongoose = require("mongoose");

const tempUserList = mongoose.model(
  "temp",
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = tempUserList;
