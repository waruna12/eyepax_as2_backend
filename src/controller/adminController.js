const authList = require("../model/authList");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utill/errorHandler");

module.exports.getallUsers = async function (req, res) {
  const resp = await authList.find();

  try {
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get all users",
        data: resp,
      });
    } else {
      const error = new Error("Can not get users");
      error.statusCode = 404;
      throw error;
    }
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.passwordUpdate = async function (req, res) {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    const resp = await authList.findById(userId);

    const hashedPw = await bcrypt.hash(newPassword, 12);

    if (resp) {
      resp.password = hashedPw;
      await resp.save();

      res.status(200).send({
        success: true,
        message: "Success change password",
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

module.exports.findUser = async function (req, res) {
  const { email } = req.params;
  try {
    const findUser = await authList.findOne({ email: email });

    res.status(200).send({
      success: true,
      message: "Find user",
      data: findUser,
    });
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.userSearch = async function (req, res) {
  const { key } = req.params;

  try {
    const userSearch = await authList.find({
      $or: [{ fname: { $regex: key } }, { lname: { $regex: key } }],
    });

    if (userSearch) {
      res.status(200).send({
        success: true,
        message: "Search user",
        data: userSearch,
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

module.exports.profileUpdate = async function (req, res) {
  const { userId } = req.params;
  const { email, fname, lname } = req.body;

  try {
    const resp = await authList.findById(userId);

    if (resp) {
      resp.email = email;
      resp.fname = fname;
      resp.lname = lname;

      await resp.save();

      res.status(200).send({
        success: true,
        message: "profile update success",
        data: resp,
      });
    }
  } catch (e) {
    const error = await errorHandler.validationError(e, res);
    return error;
  }
};

module.exports.userGetID = async function (req, res) {
  const { userId } = req.params;

  try {
    const resp = await authList.findById(userId);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get user success",
        data: resp,
      });
    } else {
      const error = new Error("No valid entry found for provided ID");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};
