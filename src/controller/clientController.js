const clientModel = require("../model/clientList");
const reservationModel = require("../model/reservationList");

// module.exports.create = async function (req, res) {
//   const { fname, lname, phone_number, email } = req.body;

//   try {
//     const client = await clientModel.findOne({ email: email });

//     if (!client) {
//       const resp = await clientModel.create({
//         fname,
//         lname,
//         phone_number,
//         email,
//       });

//       res.send({
//         success: true,
//         data: resp,
//       });
//     } else {
//       const error = new Error("Email alredy registered");
//       error.statusCode = 401;
//       throw error;
//     }
//   } catch (e) {
//     res.send({
//       success: false,
//       error: e,
//     });
//   }
// };

module.exports.create = async function (req, res) {
  const { fname, lname, phone_number, email } = req.body;

  try {
    const resp = await clientModel.create({
      fname,
      lname,
      phone_number,
      email,
    });

    res.status(201).send({
      success: true,
      data: resp,
    });
  } catch (e) {
    let errors = {};
    const allErrors = e.message.substring(e.message.indexOf(":") + 1).trim();
    const allErrorsInArrayFormat = allErrors
      .split(",")
      .map((err) => err.trim());
    allErrorsInArrayFormat.forEach((error) => {
      const [key, value] = error.split(":").map((err) => err.trim());
      errors[key] = value;
    });

    res.status(400).send({
      success: false,
      message: "Validation failed",
      case: "VALIDATION_ERROR",
      error: errors,
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
  const { client_email } = req.params;

  const { fname, lname, phone_number, email } = req.body;

  try {
    const reservationClient = await reservationModel.findOne({
      client_email: client_email,
    });

    if (!reservationClient) {
      const resp = await clientModel.findById(id);

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

module.exports.delete = async function (req, res) {
  const { id: _id } = req.params;
  const { email } = req.body;

  try {
    const reservationClient = await reservationModel.findOne({
      client_email: email,
    });

    if (!reservationClient) {
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
    res.send({
      success: false,
      error: e,
    });
  }
};

module.exports.search = async function (req, res) {
  const { key } = req.params;

  try {
    const clientSearch = await clientModel.find({
      $or: [{ fname: { $regex: key } }, { email: { $regex: key } }],
    });

    if (clientSearch) {
      res.send({
        success: true,
        data: clientSearch,
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
