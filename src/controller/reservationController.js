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
  } catch (e) {
    console.log("Error ----------- ", e);
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
  // console.log("---PARAM", id);

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

    res.send({
      success: true,
      data: resp,
    });
  }
};

module.exports.delete = async function (req, res) {
  const { id: _id } = req.params;

  const resp = await reservationModel.deleteOne({ _id });

  res.send({
    success: true,
    data: {
      id: _id,
    },
  });
};

module.exports.reservationSearch = async function (req, res) {
  const { key } = req.params;
  try {
    const reservation_search = await reservationModel.find({
      $or: [{ client_email: { $regex: key } }],
    });

    if (reservation_search) {
      res.send({
        success: true,
        data: reservation_search,
      });
    } else {
      res.send({
        success: false,
        data: [],
      });
    }
  } catch (e) {
    res.send("search failed");
  }
};

module.exports.search = async function (req, res) {
  const { date, time } = req.params;

  const styalist = [];
  const users = [];

  try {
    const stylist_search = await reservationModel.find({
      $and: [
        { reservation_date: { $regex: date } },
        { reservation_time: { $regex: time } },
      ],
    });

    stylist_search.map((x) => {
      styalist.push(x.stylist_email);
    });

    const user_search = await authList.find();

    user_search.map((x) => {
      users.push(x.email);
    });

    let unique1 = styalist.filter((o) => users.indexOf(o) === -1);
    let unique2 = users.filter((o) => styalist.indexOf(o) === -1);

    const unique = unique1.concat(unique2);

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
    const complete_reservation = await reservationModel.find({
      $or: [{ reservation_status: { $regex: key } }],
    });

    if (complete_reservation) {
      res.send({
        success: true,
        data: complete_reservation,
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
