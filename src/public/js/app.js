const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("room", { payload: input.value });
  input.value = "";
});
