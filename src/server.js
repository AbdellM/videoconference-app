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

let allSockets = [];

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  allSockets.push(socket);
  console.log("Connected to the browser ✅");
  socket.on("message", (message) =>
    allSockets.forEach((aSocket) => {
      const json = JSON.parse(message.toString());
      switch (json.type) {
        case "message":
          aSocket.send(`${socket.nickname} : ${json.payload}`);
          break;

        case "nickname":
          socket["nickname"] = json.payload;
          break;
        default:
          break;
      }
    })
  );
  socket.on("close", () => console.log("Disconnected from the browser ❌"));
});

server.listen(3000, () => {
  console.log("Listening on port http://localhost:3000/");
});
