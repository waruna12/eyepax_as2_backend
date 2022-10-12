const authList = require("../model/authList");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../utill/emailService");
const tempUser = require("../model/tempUser");
const errorHandler = require("../utill/errorHandler");

module.exports.signup = async function (req, res) {
  const { fname, lname, type, email, password } = req.body;
  const tempToken = req.params.token;

  try {
    const tempUserResult = await tempUser.findOne({ token: tempToken });

    if (tempUserResult) {
      const hashedPw = await bcrypt.hash(password, 12);
      const result = await authList.create({
        fname,
        lname,
        type,
        email,
        password: hashedPw,
      });

      const token = jwt.sign(
        {
          email,
          type,
          usetId: result._id,
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );

      res.status(200).send({
        success: true,
        message: "Create new user",
        data: { usetId: result._id, token },
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Invalid token",
        error: "Invalid token",
      });
    }
  } catch (e) {
    const error = await errorHandler.validationError(e, res);
    return error;
  }
};

module.exports.login = async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await authList.findOne({ email: email });

    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email,
        type: user.type,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res.status(200).send({
      success: true,
      message: "Login success",
      data: { usetId: user._id, token },
    });
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.inviteUser = async function (req, res) {
  const { email } = req.body;

  if (email != undefined) {
    const tempUserResult = await tempUser.findOne({ email: email });

    if (!tempUserResult) {
      const token = jwt.sign(
        {
          email,
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );

      await emailService.sendEmail(email, token);

      try {
        const resp = await tempUser.create({
          email,
          token,
        });

        res.status(201).send({
          success: true,
          message: "Send email",
          data: resp,
        });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: "Email sending failed",
          error: e,
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: "Alredy invite",
        case: "VALIDATION_ERROR",
        error: "Duplicate email",
      });
    }
  } else {
    res.status(400).send({
      success: false,
      message: "Email is required",
      case: "VALIDATION_ERROR",
      error: "Email required",
    });
  }
};
