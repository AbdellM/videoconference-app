import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const httpServer = http.createServer(app);
const socketIOServer = SocketIO(httpServer);

socketIOServer.on("connection", (socket) => {
  socket.on("room", (msg) => console.log(msg));
});

httpServer.listen(3000, () => {
  console.log("Listening on port http://localhost:3000/");
});
