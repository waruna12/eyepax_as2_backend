const express = require("express");
const adminController = require("../controller/adminController");

const router = express.Router();

router.get("/search/:key", async function (req, res) {
  await adminController.userSearch(req, res);
});

router.get("/find/:email", async function (req, res) {
  await adminController.findUser(req, res);
});

router.get("/:userId", async function (req, res) {
  await adminController.userGetID(req, res);
});

router.get("/", async function (req, res) {
  await adminController.getallUsers(req, res);
});

router.put("/:userId/:newPassword", async function (req, res) {
  await adminController.passwordUpdate(req, res);
});

router.put("/:userId", async function (req, res) {
  await adminController.profileUpdate(req, res);
});

module.exports = router;
