const mongoose = require("mongoose");

const reservationList = mongoose.model(
  "reservation",
  new mongoose.Schema(
    {
      //table name"client"
      client_email: {
        type: String,
        required: true,
      },
      service_type: {
        type: String,
        required: true,
      },
      stylist_email: {
        type: String,
        required: true,
      },
      reservation_date: {
        type: String,
        required: true,
      },
      reservation_time: {
        type: String,
        required: true,
      },
      reservation_status: {
        type: String,
        required: true,
      },
      reservation_count: {
        type: Number,
        required: true,
      },
    },
    { timestamps: true }
  )
);

module.exports = reservationList;
