const express = require("express");
const signupController = require("../controller/authController");

const router = express.Router();

router.post("/signup/:token", async function (req, res) {
  await signupController.signup(req, res);
});

router.post("/login", async function (req, res) {
  await signupController.login(req, res);
});

router.post("/inviteUser", async function (req, res) {
  await signupController.inviteUser(req, res);
});

module.exports = router;
