const express = require("express");
const clientController = require("../controller/clientController");

const router = express.Router();

router.post("/", async function (req, res) {
  await clientController.clientCreate(req, res);
});

router.get("/search/:key", async function (req, res) {
  await clientController.Clientsearch(req, res);
});

router.get("/:clientId", async function (req, res) {
  await clientController.clientGetById(req, res);
});

router.get("/", async function (req, res) {
  await clientController.ClientGetAll(req, res);
});

router.put("/:clientId", async function (req, res) {
  await clientController.clientUpdate(req, res);
});

router.delete("/:clientId", async function (req, res) {
  await clientController.clientDelete(req, res);
});

module.exports = router;
