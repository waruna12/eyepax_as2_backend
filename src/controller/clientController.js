const clientModel = require("../model/clientList");
const reservationModel = require("../model/reservationList");

module.exports.create = async function (req, res) {
  const { fname, lname, phone_number, email } = req.body;

  try {
    const client = await clientModel.findOne({ email: email });

    if (!client) {
      const resp = await clientModel.create({
        fname,
        lname,
        phone_number,
        email,
      });

      res.send({
        success: true,
        data: resp,
      });
    } else {
      const error = new Error("Email alredy registered");
      error.statusCode = 401;
      throw error;
    }
  } catch (e) {
    console.log("Error ----------- ", e);
    res.send({
      success: false,
      error: e,
    });
  }
};

module.exports.getall = async function (req, res) {
  const resp = await clientModel.find();

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

  const resp = await clientModel.findById(id);

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

  const { fname, lname, phone_number, email } = req.body;

  const resp = await clientModel.findById(id);

  console.log(resp);

  if (resp) {
    resp.fname = fname;
    resp.lname = lname;
    resp.phone_number = phone_number;
    resp.email = email;

    await resp.save();

    res.send({
      success: true,
      data: resp,
    });
  }
};

module.exports.delete = async function (req, res) {
  const { id: _id } = req.params;
  const { email } = req.body;

  try {
    const reservation_client = await reservationModel.findOne({
      client_email: email,
    });

    if (!reservation_client) {
      const resp = await clientModel.deleteOne({ _id });

      res.send({
        success: true,
        data: {
          id: _id,
        },
      });
    } else {
      const error = new Error("Cannot delete, Already have an appointment");
      error.statusCode = 401;
      throw error;
    }
  } catch (e) {
    console.log("Error ----------- ", e);
    res.send({
      success: false,
      error: e,
    });
  }
};

module.exports.search = async function (req, res) {
  const { key } = req.params;
  // console.log(req.params.key);
  try {
    const client_search = await clientModel.find({
      $or: [{ fname: { $regex: key } }, { email: { $regex: key } }],
    });

    // res.send("serch done");
    if (client_search) {
      res.send({
        success: true,
        data: client_search,
      });
    } else {
      res.send({
        success: false,
        data: [],
      });
    }
  } catch (e) {
    res.send("serch faeild");
  }
};
