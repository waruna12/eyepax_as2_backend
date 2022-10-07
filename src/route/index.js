const express = require("express");
const clientController = require("../controller/clientController");
const reservationController = require("../controller/reservationController");
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

router.get("/user/search/:key", async function (req, res) {
  await signupController.search(req, res);
});

router.get("/find-user/:email", async function (req, res) {
  await signupController.findUser(req, res);
});

router.get("/user/:id", async function (req, res) {
  await signupController.getID(req, res);
});

router.get("/user", async function (req, res) {
  await signupController.getall(req, res);
});

router.put("/user/:id/:newPassword", async function (req, res) {
  await signupController.update(req, res);
});

router.put("/user/:id", async function (req, res) {
  await signupController.profileUpdate(req, res);
});

router.post("/client", async function (req, res) {
  await clientController.create(req, res);
});

router.get("/client/search/:key", async function (req, res) {
  await clientController.search(req, res);
});

router.get("/client/:id", async function (req, res) {
  await clientController.get(req, res);
});

router.get("/client", async function (req, res) {
  await clientController.getall(req, res);
});

router.put("/client/:id", async function (req, res) {
  await clientController.update(req, res);
});

router.delete("/client/:id", async function (req, res) {
  await clientController.delete(req, res);
});

//reservation route

router.post("/reservation", async function (req, res) {
  await reservationController.create(req, res);
});

router.get("/reservation/stylistsearch/:date/:time", async function (req, res) {
  await reservationController.search(req, res);
});

router.get("/reservation/search/:key", async function (req, res) {
  await reservationController.reservationSearch(req, res);
});

router.get("/reservation/find/:key", async function (req, res) {
  await reservationController.completeReservation(req, res);
});

router.get("/reservations/stylist", async function (req, res) {
  await reservationController.eachStylistReservation(req, res);
});

router.get("/reservation/:id", async function (req, res) {
  await reservationController.get(req, res);
});

router.get("/reservation", async function (req, res) {
  await reservationController.getall(req, res);
});

router.put("/reservation/:id", async function (req, res) {
  await reservationController.update(req, res);
});

router.delete("/reservation/:id", async function (req, res) {
  await reservationController.delete(req, res);
});

router.put(
  "/drag_reservation/:id/:date/:time/:email",
  async function (req, res) {
    await reservationController.updateDragReservation(req, res);
  }
);

//use anyware export
module.exports = router;
