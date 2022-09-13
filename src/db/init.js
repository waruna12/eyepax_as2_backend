console.log("init.js waruna");

const mongoose = require("mongoose");
require("dotenv").config();

const connect = async function () {
  const conn = await mongoose.connect(process.env.MONGO);
  console.log(`Mongo DB connection establish ${conn.connection.host}`);
};

module.exports = connect;
