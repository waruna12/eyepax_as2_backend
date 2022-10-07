const nodemailer = require("nodemailer");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");

module.exports.sendEmail = async function (email, token) {
  const filePath = path.join(__dirname, "./../emailTemp.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    username: "Waruna",
    email: email,
    token: token,
  };
  const htmlToSend = template(replacements);

  let transporter = nodemailer.createTransport({
    service: "hotmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user smyp
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email, // list of receivers
    subject: "Invite User",
    html: htmlToSend,
  });
};
