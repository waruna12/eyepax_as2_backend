const express = require("express");
const signupController = require("../controller/authController");

const router = express.Router();

router.post("/signUp/:token", async function (req, res) {
  await signupController.signUpUser(req, res);
});

router.post("/login", async function (req, res) {
  await signupController.loginUser(req, res);
});

router.post("/inviteUser", async function (req, res) {
  await signupController.inviteUser(req, res);
});

module.exports = router;
