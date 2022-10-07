const mongoose = require("mongoose");

const reservationList = mongoose.model(
  "reservation",
  new mongoose.Schema(
    {
      client_email: {
        type: String,
        required: [true, "Client is required"],
      },
      service_type: {
        type: String,
        required: [true, "Service type is required"],
      },
      stylist_email: {
        type: String,
        required: [true, "Stylist is required"],
      },
      reservation_date: {
        type: String,
        required: [true, "Reservation date is required"],
      },
      reservation_time: {
        type: String,
        required: [true, "Reservation time is required"],
      },
      reservation_status: {
        type: String,
        required: [true, "Reservation status is required"],
      },
      reservation_count: {
        type: Number,
        required: [true, "Reservation count is required"],
      },
    },
    { timestamps: true }
  )
);

module.exports = reservationList;
