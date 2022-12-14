const authList = require("../model/authList");
const bcrypt = require("bcryptjs");
const errorHandler = require("../utill/errorHandler");

module.exports.getAllUsers = async function (req, res) {
  const { skip } = req.params;
  const { limit } = req.params;

  const sort = {};

  if (req.query.sortBy) {
    const str = req.query.sortBy.split(":");
    sort[str[0]] = str[1] === "desc" ? -1 : 1;
  }

  try {
    const resp = await authList.find().skip(skip).limit(limit).sort(sort);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get all users",
        data: resp,
      });
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.updateUserPassword = async function (req, res) {
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
        message: "User password updated",
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
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.searchUser = async function (req, res) {
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
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};

module.exports.updateUserProfile = async function (req, res) {
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
        message: "User profile updated",
        data: resp,
      });
    }
  } catch (e) {
    await errorHandler.validationError(e, res);
  }
};

module.exports.getUserByID = async function (req, res) {
  const { userId } = req.params;

  try {
    const resp = await authList.findById(userId);
    if (resp) {
      res.status(200).send({
        success: true,
        message: "Get user",
        data: resp,
      });
    } else {
      const error = new Error("No valid entry found for provided ID");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    await errorHandler.validatuionAllError(res, e);
  }
};
