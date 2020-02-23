const messageform = document.getElementById("send-container");
const messageinput = document.getElementById("message-input");
const messagecontainer = document.getElementById("message-container");

const name = messageform.dataset.name;

const socket = io("https://deployedbyjacksocket.herokuapp.com");

appendMessage("you joined");
socket.emit("new-user", name);

socket.on("chat-message", data => {
  appendMessage(
    `<p class = "user">${data.name}</p><p class = "message">${data.message}</p?`,
    "not-you"
  );
});

socket.on("user-connected", name => {
  appendMessage(`${name}:connected`);
});

socket.on("user-disconnected", name => {
  appendMessage(`${name}:disconnected`);
});

messageform.addEventListener("submit", e => {
  e.preventDefault();
  if (!messageinput.value) {
    return;
  }
  const message = messageinput.value;
  const messageelement = document.createElement("div");
  messageelement.innerText = `${message}`;
  messagecontainer.prepend(messageelement);
  messageelement.classList.add("you", "messages");
  socket.emit("send-chat-message", message);
  messageinput.value = "";
});

function appendMessage(message, connection) {
  const messageelement = document.createElement("div");
  messageelement.innerText = message;
  if (connection === "you") {
    messageelement.classList.add(connection, "messages");
  } else if (connection === "not-you") {
    messageelement.innerHTML = message;
    messageelement.classList.add(connection, "messages");
  } else {
    messageelement.classList.add("connection", "messages");
  }
  messagecontainer.prepend(messageelement);
}

messagecontainer.scrollTop = messagecontainer.scrollHeight;
