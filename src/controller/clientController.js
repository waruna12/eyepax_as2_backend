const clientModel = require("../model/clientList");
const reservationModel = require("../model/reservationList");
const errorHandler = require("../utill/errorHandler");

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
      message: "Client create success",
      data: resp,
    });
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

module.exports.getall = async function (req, res) {
  try {
    const resp = await clientModel.find().skip(1).limit(2);

    res.status(200).send({
      success: true,
      message: "Get all clients success",
      data: resp,
    });
  } catch (e) {
    res.status(500).send({
      success: false,
      error: e,
    });
  }
};

module.exports.get = async function (req, res) {
  const { id } = req.params;

  try {
    const resp = await clientModel.findById(id);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get client success",
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
      error: e,
    });
  }
};

module.exports.update = async function (req, res) {
  const { id } = req.params;
  const { fname, lname, phone_number, email } = req.body;

  try {
    const reservationClient = await reservationModel.findOne({
      client_email: email,
    });

    if (!reservationClient) {
      const resp = await clientModel.findById(id);

      if (resp) {
        resp.fname = fname;
        resp.lname = lname;
        resp.phone_number = phone_number;
        resp.email = email;

        await resp.save();

        res.status(200).send({
          success: true,
          message: "Client update success",
          data: resp,
        });
      }
    } else {
      res.status(401).send({
        success: false,
        message: "Cannot update, Already have an appointment",
        error: "Can not update",
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

module.exports.delete = async function (req, res) {
  const { id: _id } = req.params;
  const { email } = req.body;

  try {
    if (email) {
      const reservationClient = await reservationModel.findOne({
        client_email: email,
      });
      if (!reservationClient) {
        const resp = await clientModel.deleteOne({ _id });

        if (resp.deletedCount > 0) {
          res.status(200).send({
            success: true,
            message: "Client delete success",
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
      } else {
        res.status(401).send({
          success: false,
          message: "Cannot delete, Already have an appointment",
          error: "Can not delete",
        });
      }
    } else {
      res.status(500).send({
        success: false,
        message: "Email is required",
        error: "Email is required",
      });
    }
  } catch (e) {
    res.status(500).send({
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
      res.status(200).send({
        success: true,
        data: clientSearch,
      });
    } else {
      res.status(401).send({
        success: false,
        message: "Cannot search",
        error: "Can not search",
      });
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      error: e,
    });
  }
};
