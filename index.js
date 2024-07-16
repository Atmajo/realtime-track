const { configDotenv } = require("dotenv");
const express = require("express");
const app = express();
configDotenv();

const http = require("http");
const path = require("path");

const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/coords", (req, res) => {
  res.send("Hello Tracker");
  io.on("connection", (socket) => {
    socket.on("send-location", (coords) => {
      io.emit("receive-location", { id: socket.id, ...coords });
      res.send({ coords: coords });
    });

    socket.on("disconnect", () => {
      io.emit("user-disconnected", socket.id);
      res.send({ id: socket.id });
    });
  });
});

app.get("/track", (req, res) => {
  res.render("index");
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
