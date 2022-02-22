import express from "express";
import http from "http";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });

wsServer.on("connection", (socket) => {
  console.log("Connected to the browser ✅");
  socket.send("hello");
  socket.on("message", (message) => console.log(message.toString()));
  socket.on("close", () => console.log("Disconnected from the browser ❌"));
});

server.listen(3000, () => {
  console.log("Listening on port http://localhost:3000/");
});
