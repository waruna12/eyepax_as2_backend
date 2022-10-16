const authList = require("../model/authList");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../utill/emailService");
const tempUser = require("../model/tempUser");
const errorHandler = require("../utill/errorHandler");

module.exports.signUpUser = async function (req, res) {
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
        message: "User created",
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

module.exports.loginUser = async function (req, res) {
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
      message: "User logged",
      data: { usetId: user._id, token },
    });
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};

module.exports.inviteUser = async function (req, res) {
  const { email } = req.body;

  try {
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

        const resp = await tempUser.create({
          email,
          token,
        });

        res.status(201).send({
          success: true,
          message: "Send email",
          data: resp,
        });
      } else {
        const error = new Error("Alredy invite");
        error.statusCode = 400;
        throw error;
      }
    } else {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }
  } catch (e) {
    const error = await errorHandler.validatuionAllError(res, e);
    return error;
  }
};
