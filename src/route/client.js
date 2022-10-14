const express = require("express");
const clientController = require("../controller/clientController");

const router = express.Router();

router.post("/", async function (req, res) {
  await clientController.createClient(req, res);
});

router.get("/search/:key", async function (req, res) {
  await clientController.searchClient(req, res);
});

router.get("/getAllClients/skip/:skip/limit/:limit", async function (req, res) {
  await clientController.getAllClient(req, res);
});

router.get("/:clientId", async function (req, res) {
  await clientController.getClientById(req, res);
});

router.put("/:clientId", async function (req, res) {
  await clientController.updateClient(req, res);
});

router.delete("/:clientId", async function (req, res) {
  await clientController.deleteClient(req, res);
});

module.exports = router;
