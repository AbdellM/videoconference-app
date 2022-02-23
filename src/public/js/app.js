const socketConnection = new WebSocket(`ws://${window.location.host}`);

const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nicknameForm = document.querySelector("#nickname");

socketConnection.addEventListener("open", () => {
  console.log("Connected to the server ✅");
});

socketConnection.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socketConnection.addEventListener("close", () => {
  console.log("Disconnected from the server ❌");
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socketConnection.send(
    JSON.stringify({ type: "message", payload: input.value })
  );
  input.value = "";
});

nicknameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socketConnection.send(
    JSON.stringify({ type: "nickname", payload: input.value })
  );
});
