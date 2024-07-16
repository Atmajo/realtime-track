const express = require("express");
const app = express();

const http = require("http");
const path = require("path");

const socket = require("socket.io");
const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New connection");
  socket.on("send-location", (coords) => {
    console.log(coords);
    io.emit("receive-location", { id: socket.id, ...coords });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello Tracker");
});

app.get("/track", (req, res) => {
  res.render("index");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
