const express = require("express");
const contacts = require("./contacts.json");

const {
  env: { HOST, PORT, DELAY },
} = process;

const server = express();

server.get("/contacts", (request, response) => {
  const callback = () => response.status(200).json(contacts);
  setTimeout(callback, DELAY);
});

server.listen(PORT, () => console.log(`[server] ${HOST}:${PORT}`));
