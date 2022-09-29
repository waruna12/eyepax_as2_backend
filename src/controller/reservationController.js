const reservationModel = require("../model/reservationList");
const authList = require("../model/authList");

module.exports.create = async function (req, res) {
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

      res.send({
        success: true,
        data: resp,
      });
    } else {
      res.send({
        success: false,
        data: [],
      });
    }
  } catch (e) {
    res.send({
      success: false,
      error: e,
    });
  }
};

module.exports.getall = async function (req, res) {
  const resp = await reservationModel.find();

  if (resp) {
    res.send({
      success: true,
      data: resp,
    });
  } else {
    res.send({
      success: false,
      data: [],
    });
  }
};

module.exports.get = async function (req, res) {
  const { id } = req.params;
  const resp = await reservationModel.findById(id);

  if (resp) {
    res.send({
      success: true,
      data: resp,
    });
  } else {
    res.send({
      success: false,
      data: [],
    });
  }
};

module.exports.update = async function (req, res) {
  const { id } = req.params;
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
    const resp = await reservationModel.findById(id);

    if (resp) {
      resp.client_email = client_email;
      resp.service_type = service_type;
      resp.stylist_email = stylist_email;
      resp.reservation_date = reservation_date;
      resp.reservation_time = reservation_time;
      resp.reservation_status = reservation_status;
      resp.reservation_count = reservation_count;

      await resp.save();

      res.status(201).send({
        success: true,
        message: "Reservation updated",
        data: resp,
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      error: e,
    });
  }
};

module.exports.delete = async function (req, res) {
  const { id: _id } = req.params;

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
      res.status(404).send({
        success: false,
        message: "No valid entry found for provided ID",
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
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
      res.send({
        success: true,
        data: reservationSearch,
      });
    } else {
      res.send({
        success: false,
        data: [],
      });
    }
  } catch (e) {
    res.send("Search failed");
  }
};

module.exports.search = async function (req, res) {
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

    stylistSearch.forEach((x) => {
      styalist.push(x.stylist_email);
    });

    const userSearch = await authList.find();

    userSearch.forEach((x) => {
      users.push(x.email);
    });

    let uniqueOne = styalist.filter((o) => users.indexOf(o) === -1);
    let uniqueTwo = users.filter((o) => styalist.indexOf(o) === -1);

    const unique = uniqueOne.concat(uniqueTwo);

    if (unique) {
      res.send({
        success: true,
        data: unique,
      });
    } else {
      res.send({
        success: false,
        data: [],
      });
    }
  } catch (e) {
    res.send("stylist search failed");
  }
};

module.exports.completeReservation = async function (req, res) {
  const { key } = req.params;
  try {
    const completeReservation = await reservationModel.find({
      $or: [{ reservation_status: { $regex: key } }],
    });

    if (completeReservation) {
      res.send({
        success: true,
        data: completeReservation,
      });
    } else {
      res.send({
        success: false,
        data: [],
      });
    }
  } catch (e) {
    res.send("Failed search complete reservation");
  }
};

module.exports.eachStylistReservation = async function (req, res) {
  const resp = await reservationModel.aggregate([
    { $match: {} },
    {
      $group: { _id: "$stylist_email", value: { $sum: "$reservation_count" } },
    },
  ]);

  if (resp) {
    res.send({
      success: true,
      data: resp,
    });
  } else {
    res.send({
      success: false,
      data: [],
    });
  }
};

module.exports.updateDragReservation = async function (req, res) {
  const { id } = req.params;
  const { date } = req.params;
  const { time } = req.params;
  const { email } = req.params;

  const { client_email, service_type, reservation_status, reservation_count } =
    req.body;

  const availble_reservation = await reservationModel.find({
    $and: [
      { reservation_date: { $regex: date } },
      { reservation_time: { $regex: time } },
      { stylist_email: { $regex: email } },
    ],
  });

  if (availble_reservation.length > 0) {
    res.send({
      success: false,
      data: [],
    });
  } else {
    const resp = await reservationModel.findById(id);

    if (resp) {
      resp.client_email = client_email;
      resp.service_type = service_type;
      resp.stylist_email = email;
      resp.reservation_date = date;
      resp.reservation_time = time;
      resp.reservation_status = reservation_status;
      resp.reservation_count = reservation_count;

      await resp.save();

      res.send({
        success: true,
        data: resp,
      });
    }
  }
};
