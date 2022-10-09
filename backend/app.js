//Imports
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app = express();
//Routes
const post = require("./routes/post-route");
//Middlewares
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.use("/api/v1", post);

module.exports = app;
