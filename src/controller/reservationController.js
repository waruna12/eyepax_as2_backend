const reservationModel = require("../model/reservationList");
const authList = require("../model/authList");
const moment = require("moment");
const errorHandler = require("../utill/errorHandler");

module.exports.reservationCreate = async function (req, res) {
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

      res.status(200).send({
        success: true,
        message: "Reservation create success",
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
    const error = await errorHandler.validationError(e);
    res.status(500).send({
      success: false,
      message: "Validation failed",
      case: "VALIDATION_ERROR",
      error: error,
    });
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
    res.status(500).send({
      success: false,
      message: "Can not get reservations",
      error: e,
    });
  }
};

module.exports.getReservationById = async function (req, res) {
  const { reservationId } = req.params;

  try {
    const resp = await reservationModel.findById(reservationId);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get reservation success",
        data: resp,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "No valid entry found for provided ID",
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};

module.exports.reservationUpdate = async function (req, res) {
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
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};

module.exports.reservationDelete = async function (req, res) {
  const { reservationId: _id } = req.params;

  try {
    const resp = await reservationModel.deleteOne({ _id });

    if (resp.deletedCount > 0) {
      res.status(200).send({
        success: true,
        message: "Reservation delete success",
        data: {
          id: _id,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        message: "No valid entry found for provided ID",
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};

module.exports.reservationSearch = async function (req, res) {
  const { key } = req.params;
  try {
    const reservationSearch = await reservationModel.find({
      $or: [{ client_email: { $regex: key } }],
    });

    if (reservationSearch) {
      res.status(200).send({
        success: true,
        data: reservationSearch,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Cannot search",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Search failed",
      error: e,
    });
  }
};

module.exports.stylistSearch = async function (req, res) {
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
        message: "Success search stylist",
        data: uniqueResponse,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Can not search stylist",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};

module.exports.completeReservation = async function (req, res) {
  const { key } = req.params;
  try {
    const completeReservation = await reservationModel.find({
      $or: [{ reservation_status: { $regex: key } }],
    });

    if (completeReservation) {
      res.status(200).send({
        success: true,
        message: "Success get complete reservation",
        data: completeReservation,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed get complete reservationn",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};

module.exports.eachStylistReservationPerWeek = async function (req, res) {
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
      res.status(400).send({
        success: false,
        message: "Failed get stylist",
        data: [],
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "Validation failed",
      error: e,
    });
  }
};

module.exports.updateDragReservation = async function (req, res) {
  const { reservationId } = req.params;
  const { date } = req.params;
  const { time } = req.params;
  const { email } = req.params;

  const { client_email, service_type, reservation_status, reservation_count } =
    req.body;

  try {
    const availble_reservation = await reservationModel.find({
      $and: [
        { reservation_date: { $regex: date } },
        { reservation_time: { $regex: time } },
        { stylist_email: { $regex: email } },
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
        resp.stylist_email = email;
        resp.reservation_date = date;
        resp.reservation_time = time;
        resp.reservation_status = reservation_status;
        resp.reservation_count = reservation_count;

        await resp.save();

        res.status(200).send({
          success: true,
          message: "Reservation updated success",
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

// module.exports.updateDragReservation = async function (req, res) {
//   const { reservationId } = req.params;
//   const { date } = req.params;
//   const { time } = req.params;
//   const { email } = req.params;

//   const { client_email, service_type, reservation_status, reservation_count } =
//     req.body;

//   const availble_reservation = await reservationModel.find({
//     $and: [
//       { reservation_date: { $regex: date } },
//       { reservation_time: { $regex: time } },
//       { stylist_email: { $regex: email } },
//     ],
//   });

//   if (availble_reservation.length > 0) {
//     res.send({
//       success: false,
//       data: [],
//     });
//   } else {
//     const resp = await reservationModel.findById(reservationId);

//     if (resp) {
//       resp.client_email = client_email;
//       resp.service_type = service_type;
//       resp.stylist_email = email;
//       resp.reservation_date = date;
//       resp.reservation_time = time;
//       resp.reservation_status = reservation_status;
//       resp.reservation_count = reservation_count;

//       await resp.save();

//       res.send({
//         success: true,
//         data: resp,
//       });
//     }
//   }
// };
