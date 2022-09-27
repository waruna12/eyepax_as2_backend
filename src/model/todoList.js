console.log("todolist.js waruna");

const mongoose = require("mongoose");

const todoList = mongoose.model(
  "todos",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      desc: {
        type: String,
      },
    },
    { timestamps: true }
  )
);

module.exports = todoList;
