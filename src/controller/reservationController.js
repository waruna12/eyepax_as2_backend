const reservationModel = require("../model/reservationList");
const authList = require("../model/authList");
const moment = require("moment");
const errorHandler = require("../utill/errorHandler");

module.exports.createReservation = async function (req, res) {
  const {
    client_email,
    service_type,
    stylist_email,
    reservation_date,
    reservation_time,
    reservation_status,
    reservation_count,
  } = req.body;

  try {
    const reservationDuplicate = await reservationModel.find({
      $and: [
        { client_email: { $regex: client_email } },
        { service_type: { $regex: service_type } },
        { reservation_date: { $regex: reservation_date } },
      ],
    });
    if (reservationDuplicate.length === 0) {
      const resp = await reservationModel.create({
        client_email,
        service_type,
        stylist_email,
        reservation_date,
        reservation_time,
        reservation_status,
        reservation_count,
      });

      res.status(201).send({
        success: true,
        message: "Reservation created",
        data: resp,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Reservation duplicate",
        data: [],
      });
    }
  } catch (e) {
    await errorHandler.validationError(e, res);
  }
};

module.exports.getAllReservation = async function (req, res) {
  try {
    const resp = await reservationModel.find();

    res.status(200).send({
      success: true,
      message: "Get all reservation success",
      data: resp,
    });
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.getReservationById = async function (req, res) {
  const { reservationId } = req.params;

  try {
    const resp = await reservationModel.findById(reservationId);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get reservation",
        data: resp,
      });
    } else {
      const error = new Error("No valid entry found for provided ID");
      error.statusCode = 404;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.updateReservation = async function (req, res) {
  const { reservationId } = req.params;
  const {
    client_email,
    service_type,
    stylist_email,
    reservation_date,
    reservation_time,
    reservation_status,
    reservation_count,
  } = req.body;

  try {
    const resp = await reservationModel.findById(reservationId);

    if (resp) {
      resp.client_email = client_email;
      resp.service_type = service_type;
      resp.stylist_email = stylist_email;
      resp.reservation_date = reservation_date;
      resp.reservation_time = reservation_time;
      resp.reservation_status = reservation_status;
      resp.reservation_count = reservation_count;

      await resp.save();
      res.status(200).send({
        success: true,
        message: "Reservation updated",
        data: resp,
      });
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.deleteReservation = async function (req, res) {
  const { reservationId: _id } = req.params;

  try {
    const resp = await reservationModel.deleteOne({ _id });

    if (resp.deletedCount > 0) {
      res.status(200).send({
        success: true,
        message: "Reservation deleted",
        data: {
          id: _id,
        },
      });
    } else {
      const error = new Error("No valid entry found for provided ID");
      error.statusCode = 404;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.searchReservation = async function (req, res) {
  const { key } = req.params;
  try {
    const reservationSearch = await reservationModel.find({
      $or: [{ client_email: { $regex: key } }],
    });

    if (reservationSearch) {
      res.status(200).send({
        success: true,
        message: "Search reservation",
        data: reservationSearch,
      });
    } else {
      const error = new Error("Cannot search reservation");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.searchStylist = async function (req, res) {
  const { date, time } = req.params;

  const styalist = [];
  const users = [];

  try {
    const stylistSearch = await reservationModel.find({
      $and: [
        { reservation_date: { $regex: date } },
        { reservation_time: { $regex: time } },
      ],
    });

    stylistSearch.forEach((stylist) => {
      styalist.push(stylist.stylist_email);
    });

    const userSearch = await authList.find();

    userSearch.forEach((user) => {
      users.push(user.email);
    });

    let uniqueStylist = styalist.filter((o) => users.indexOf(o) === -1);
    let uniqueUser = users.filter((o) => styalist.indexOf(o) === -1);

    const uniqueResponse = uniqueStylist.concat(uniqueUser);

    if (uniqueResponse) {
      res.status(200).send({
        success: true,
        message: "Search stylist",
        data: uniqueResponse,
      });
    } else {
      const error = new Error("Cannot search stylist");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.getAllCompleteReservation = async function (req, res) {
  const { key } = req.params;
  try {
    const completeReservation = await reservationModel.find({
      $or: [{ reservation_status: { $regex: key } }],
    });

    if (completeReservation) {
      res.status(200).send({
        success: true,
        message: "Get complete reservations",
        data: completeReservation,
      });
    } else {
      const error = new Error("Cannot get complete reservation");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.getEachStylistReservationPerWeek = async function (req, res) {
  let Dateformat = "YYYY-MM-DD";
  let currentDate = new Date(); // get current date
  let first = currentDate.getDate() - currentDate.getDay(); // First day is the day of the month - the day of the week
  let last = first + 6; // last day is the first day + 6

  let firstday = new Date(currentDate.setDate(first)).toUTCString();
  let lastday = new Date(currentDate.setDate(last)).toUTCString();

  let formatFirtDate = moment(firstday).format(Dateformat);
  let formatLastDate = moment(lastday).format(Dateformat);

  try {
    const resp = await reservationModel.aggregate([
      {
        $match: {
          reservation_date: { $gt: formatFirtDate, $lt: formatLastDate },
        },
      },
      {
        $group: {
          _id: "$stylist_email",
          value: { $sum: "$reservation_count" },
        },
      },
    ]);

    if (resp) {
      res.status(200).send({
        success: true,
        message: "Success get stylist",
        data: resp,
      });
    } else {
      const error = new Error("Failed get stylist");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.updateDragReservation = async function (req, res) {
  const { reservationId } = req.params;
  const { date } = req.params;
  const { time } = req.params;
  const { stylist } = req.params;

  const { client_email, service_type, reservation_status, reservation_count } =
    req.body;

  try {
    const availble_reservation = await reservationModel.find({
      $and: [
        { reservation_date: { $regex: date } },
        { reservation_time: { $regex: time } },
        { stylist_email: { $regex: stylist } },
      ],
    });

    if (availble_reservation.length > 0) {
      res.status(400).send({
        success: false,
        message: "Not available",
        data: [],
      });
    } else {
      const resp = await reservationModel.findById(reservationId);

      if (resp) {
        resp.client_email = client_email;
        resp.service_type = service_type;
        resp.stylist_email = stylist;
        resp.reservation_date = date;
        resp.reservation_time = time;
        resp.reservation_status = reservation_status;
        resp.reservation_count = reservation_count;

        await resp.save();

        res.status(200).send({
          success: true,
          message: "Reservation updated",
          data: resp,
        });
      }
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};
