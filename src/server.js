import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));

const httpServer = http.createServer(app);
const socketIOServer = SocketIO(httpServer);

socketIOServer.on("connection", (socket) => {
  socket.on("join-room", (roomName, doneFnc) => {
    socket.join(roomName);
    doneFnc();
    socket.to(roomName).emit("welcome");
  });
});

httpServer.listen(3000, () => {
  console.log("Listening on port http://localhost:3000/");
});
