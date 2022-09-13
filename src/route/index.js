const express = require("express");
const todoController = require("../controller/todoController");
const clientController = require("../controller/clientController");
const reservationController = require("../controller/reservationController");
const signupController = require("../controller/authController");

const router = express.Router();

router.post("/todo", async function (req, res) {
  console.log("--PAYLOAD", req.body);
  //call the fuction and logic there
  await todoController.create(req, res);
});

router.get("/todo", async function (req, res) {
  await todoController.getall(req, res);
});

router.get("/todo/:id", async function (req, res) {
  await todoController.get(req, res);
});
router.put("/todo/:id", async function (req, res) {
  await todoController.update(req, res);
});
router.delete("/todo/:id", async function (req, res) {
  await todoController.delete(req, res);
});

///////////////

router.post("/signup/:token", async function (req, res) {
  await signupController.signup(req, res);
});

router.post("/login", async function (req, res) {
  await signupController.login(req, res);
});

router.get("/user", async function (req, res) {
  await signupController.getall(req, res);
});

router.get("/invite-user/:email", async function (req, res) {
  await signupController.inviteUser(req, res);
});

//client route
router.post("/client", async function (req, res) {
  await clientController.create(req, res);
});

router.get("/client", async function (req, res) {
  await clientController.getall(req, res);
});

router.get("/client/:id", async function (req, res) {
  await clientController.get(req, res);
});

router.put("/client/:id", async function (req, res) {
  await clientController.update(req, res);
});

router.delete("/client/:id", async function (req, res) {
  await clientController.delete(req, res);
});

router.get("/client/search/:key", async function (req, res) {
  await clientController.search(req, res);
});

//reservation route'

router.post("/reservation", async function (req, res) {
  await reservationController.create(req, res);
});

router.get("/reservation", async function (req, res) {
  await reservationController.getall(req, res);
});

router.get("/reservation/:id", async function (req, res) {
  await reservationController.get(req, res);
});

router.put("/reservation/:id", async function (req, res) {
  await reservationController.update(req, res);
});

router.delete("/reservation/:id", async function (req, res) {
  await reservationController.delete(req, res);
});

router.get("/reservation/search/:key", async function (req, res) {
  await reservationController.reservationSearch(req, res);
});

router.get("/reservation/stylistsearch/:date/:time", async function (req, res) {
  await reservationController.search(req, res);
});

router.get("/reservation/find/:key", async function (req, res) {
  await reservationController.completeReservation(req, res);
});

router.get("/reservations/stylist", async function (req, res) {
  await reservationController.eachStylistReservation(req, res);
});

//use anyware export
module.exports = router;
