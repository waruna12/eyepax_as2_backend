const express = require("express"); //import express
const bodyParser = require("body-parser");
const dbConnection = require("./db/init");
const server = express();
const cors = require("cors");

const router = require("./route");

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
server.use("/api", router); //wildcard(api/use postman)

dbConnection();

//rununig port 3000 express
server.listen(3000, function () {
  console.log("server stated on port 3000 - new line");
});

// server.get("/" , function(req,res){
//     res.send("Hello waruna");
// })

// server.post("/" , function(req,res){
//    console.log('INPUT' , req.body);
// })
