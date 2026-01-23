const socket = io();

// Récupération de l'utilisateur connecté
const user = JSON.parse(sessionStorage.getItem("ordopass_user") || "{}");
socket.emit("join", user);

// Messages système
socket.on("system", (msg) => {
  const div = document.createElement("div");
  div.className = "system";
  div.textContent = msg.text;
  document.getElementById("messages").appendChild(div);
});

// Messages chat
socket.on("chat:message", (msg) => {
  const div = document.createElement("div");
  div.className = "msg";
  div.innerHTML = `<strong>${msg.from} (${msg.role}) :</strong> ${msg.text}`;
  document.getElementById("messages").appendChild(div);
});

// Envoi message
document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("msgInput");
  if (!input.value.trim()) return;
  socket.emit("chat:message", { text: input.value });
  input.value = "";
});
