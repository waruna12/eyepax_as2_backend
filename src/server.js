const express = require("express");
const bodyParser = require("body-parser");
const dbConnection = require("./db/init");
const server = express();
const cors = require("cors");

const router = require("./route");
const clientRouter = require("./route/client");
const reservationRouter = require("./route/reservation");
const adminRouter = require("./route/admin");

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(
  cors({
    origin: "*",
  })
);
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

server.use("/api", router);
server.use("/api/user", adminRouter);
server.use("/api/client", clientRouter);
server.use("/api/reservation", reservationRouter);

dbConnection();

//rununig port 3000 express
server.listen(3000, function () {
  console.log("server stated on port 3000 - new line");
});
