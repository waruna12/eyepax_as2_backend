const clientModel = require("../model/clientList");
const reservationModel = require("../model/reservationList");
const errorHandler = require("../utill/errorHandler");

module.exports.clientCreate = async function (req, res) {
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
    const error = await errorHandler.validationError(e, res);
    return error;
  }
};

module.exports.ClientGetAll = async function (req, res) {
  try {
    const resp = await clientModel.find();

    res.status(200).send({
      success: true,
      message: "Get all clients",
      data: resp,
    });
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.clientGetById = async function (req, res) {
  const { clientId } = req.params;

  try {
    const resp = await clientModel.findById(clientId);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Client get success",
        data: resp,
      });
    } else {
      const error = new Error("No valid entry found for provided ID");
      error.statusCode = 404;
      throw error;
    }
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.clientUpdate = async function (req, res) {
  const { clientId } = req.params;
  const { fname, lname, phone_number, email } = req.body;

  try {
    const reservationClient = await reservationModel.findOne({
      client_email: email,
    });

    if (!reservationClient) {
      const resp = await clientModel.findById(clientId);

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
      res.status(400).send({
        success: false,
        message: "Cannot update, Already have an appointment",
        error: "Can not update",
      });
    }
  } catch (e) {
    const error = await errorHandler.validationError(e, res);
    return error;
  }
};

module.exports.clientDelete = async function (req, res) {
  const { clientId: _id } = req.params;
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
          const error = new Error("No valid entry found for provided ID");
          error.statusCode = 400;
          throw error;
        }
      } else {
        const error = new Error("Cannot delete, Already have an appointment");
        error.statusCode = 400;
        throw error;
      }
    } else {
      const error = new Error("Email is required");
      error.statusCode = 500;
      throw error;
    }
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.Clientsearch = async function (req, res) {
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
      const error = new Error("Cannot search");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};
