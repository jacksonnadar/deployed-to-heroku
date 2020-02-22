const messageform = document.getElementById("send-container");
const messageinput = document.getElementById("message-input");
const messagecontainer = document.getElementById("message-container");

const name = messageform.dataset.name;

const socket = io("https://deployedbyjacksocket.herokuapp.com");

appendMessage("you joined");
socket.emit("new-user", name);

socket.on("chat-message", data => {
  appendMessage(`${data.name}:${data.message}`);
});

socket.on("user-connected", name => {
  appendMessage(`${name}:connected`);
});

socket.on("user-disconnected", name => {
  appendMessage(`${name}:disconnected`);
});

messageform.addEventListener("submit", e => {
  e.preventDefault();
  const message = messageinput.value;
  const messageelement = document.createElement("div");
  messageelement.innerText = `you:${message}`;
  messagecontainer.append(messageelement);

  socket.emit("send-chat-message", message);
  messageinput.value = "";
});

function appendMessage(message) {
  const messageelement = document.createElement("div");
  messageelement.innerText = message;

  messagecontainer.append(messageelement);
}
