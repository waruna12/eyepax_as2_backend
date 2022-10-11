const express = require("express");
const reservationController = require("../controller/reservationController");

const router = express.Router();

router.post("/", async function (req, res) {
  await reservationController.reservationCreate(req, res);
});

router.get("/stylistSearch/:date/:time", async function (req, res) {
  await reservationController.stylistSearch(req, res);
});

router.get("/search/:key", async function (req, res) {
  await reservationController.reservationSearch(req, res);
});

router.get("/find/:key", async function (req, res) {
  await reservationController.completeReservation(req, res);
});

router.get("/stylist", async function (req, res) {
  await reservationController.eachStylistReservationPerWeek(req, res);
});

router.get("/:reservationId", async function (req, res) {
  await reservationController.getReservationById(req, res);
});

router.get("/", async function (req, res) {
  await reservationController.getAllReservation(req, res);
});

router.put(
  "/dragReservation/:reservationId/:date/:time/:email",
  async function (req, res) {
    await reservationController.updateDragReservation(req, res);
  }
);

router.put("/:reservationId", async function (req, res) {
  await reservationController.reservationUpdate(req, res);
});

router.delete("/:reservationId", async function (req, res) {
  await reservationController.reservationDelete(req, res);
});

module.exports = router;
