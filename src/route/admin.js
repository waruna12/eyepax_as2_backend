const express = require("express");
const adminController = require("../controller/adminController");

const router = express.Router();

router.get("/getAllUsers/skip/:skip/limit/:limit", async function (req, res) {
  await adminController.getAllUsers(req, res);
});

router.get("/signUp/findUser/:email", async function (req, res) {
  await adminController.findUser(req, res);
});

router.get("/search/:key", async function (req, res) {
  await adminController.searchUser(req, res);
});

router.get("/:userId", async function (req, res) {
  await adminController.getUserByID(req, res);
});

router.put("/changePassword/:userId", async function (req, res) {
  await adminController.updateUserPassword(req, res);
});

router.put("/profileUpdate/:userId", async function (req, res) {
  await adminController.updateUserProfile(req, res);
});

module.exports = router;
