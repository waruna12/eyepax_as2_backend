const authList = require("../model/authList");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../utill/emailService");
const tempUser = require("../model/tempUser");

module.exports.signup = async function (req, res) {
  const { fname, lname, type, email, password } = req.body;

  try {
    const tempToken = req.params.token;
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

      res.send({
        success: true,
        data: { usetId: result._id, token },
      });
    } else {
      res.send({
        success: false,
        error: e,
      });
    }
  } catch (e) {
    res.send({
      success: false,
      error: e,
    });
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

    //cret token
    const token = jwt.sign(
      {
        email,
        type: user.type,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res.send({
      success: true,
      data: { usetId: user._id, token },
    });
  } catch (e) {
    res.send({
      success: false,
      error: e,
    });
  }
};

module.exports.getall = async function (req, res) {
  const resp = await authList.find();

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

module.exports.inviteUser = async function (req, res) {
  const email = req.params.email;
  const tempUserResult = await tempUser.findOne({ email: email });

  if (!tempUserResult) {
    const token = jwt.sign(
      {
        email,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    const sendEmail = await emailService.sendEmail(email, token);

    try {
      const resp = await tempUser.create({
        email,
        token,
      });

      res.send({
        success: true,
        data: resp,
      });
    } catch (e) {
      res.send({
        success: false,
        error: e,
      });
    }
  } else {
    res.send({
      success: false,
      // error: e,
    });
  }
};

module.exports.update = async function (req, res) {
  const { id } = req.params;
  const { newPassword } = req.params;

  const resp = await authList.findById(id);

  const hashedPw = await bcrypt.hash(newPassword, 12);

  if (resp) {
    resp.password = hashedPw;
    await resp.save();

    res.send({
      success: true,
      data: resp,
    });
  }
};
