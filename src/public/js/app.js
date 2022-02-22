const socketConnection = new WebSocket(`ws://${window.location.host}`);

socketConnection.addEventListener("open", () => {
  console.log("Connected to the server ✅");
});

socketConnection.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

socketConnection.addEventListener("close", () => {
  console.log("Disconnected from the server ❌");
});

setTimeout(() => {
  socketConnection.send("Hello from the browser !!!");
}, 3000);
