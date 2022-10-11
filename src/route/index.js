const express = require("express");
const signupController = require("../controller/authController");

const router = express.Router();

router.post("/signup/:token", async function (req, res) {
  await signupController.signup(req, res);
});

router.post("/invite-user", async function (req, res) {
  await signupController.inviteUser(req, res);
});

router.post("/login", async function (req, res) {
  await signupController.login(req, res);
});

// router.get("/user/search/:key", async function (req, res) {
//   await signupController.search(req, res);
// });

// router.get("/find-user/:email", async function (req, res) {
//   await signupController.findUser(req, res);
// });

// router.get("/user/:id", async function (req, res) {
//   await signupController.getID(req, res);
// });

// router.get("/user", async function (req, res) {
//   await signupController.getall(req, res);
// });

// router.put("/user/:id/:newPassword", async function (req, res) {
//   await signupController.update(req, res);
// });

// router.put("/user/:id", async function (req, res) {
//   await signupController.profileUpdate(req, res);
// });

//use anyware export
module.exports = router;
