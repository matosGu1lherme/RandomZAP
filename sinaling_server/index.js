const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const app = express();

const port = process.env.PORT || 9000;

//Inicializando um http server
const server = http.createServer(app);

//Inicializando WebSocket
const wss = new WebSocket.Server({ server });

// create an object to store users
let users = {};

// utility to send message to one user
const sendTo = (connection, message) => {
  connection.send(JSON.stringify(message));
};

// utility to send message to all users

const sendToAll = (clients, type, { id, name: userName }) => {
  Object.values(clients).forEach((client) => {
    if (client.name !== userName) {
      client.send(
        JSON.stringify({
          type,
          user: { id, userName },
        })
      );
    }
  });
};

wss.on("connection", (ws) => {
  ws.on("message", (msg) => {
    let data;
    //accepting only JSON messages
    try {
      console.log("Received message: %s from client", msg);
      data = JSON.parse(msg);
    } catch (e) {
      console.log("Invalid JSON");
      data = {};
    }
    const { type, name, offer, answer } = data;
    //Handle message by type
    switch (type) {
      //when a user tries to login
      case "login":
        //Check if username is available
        if (users[name]) {
          sendTo(ws, {
            type: "login",
            success: false,
            message: "Username is unavailable",
          });
        } else {
          const id = uuidv4();
          const loggedIn = Object.values(users).map(
            ({ id, name: userName }) => ({ id, userName })
          );
          users[name] = ws;
          ws.name = name;
          ws.id = id;
          sendTo(ws, {
            type: "login",
            success: true,
            users: loggedIn,
          });
          sendToAll(users, "updateUsers", ws);
        }
        break;
      default:
        sendTo(ws, {
          type: "error",
          message: "Command not found: " + type,
        });
        break;

      case "offer":
        //Check if user to send offer to exists
        const offerRecipient = users[name];
        if (!!offerRecipient) {
          sendTo(offerRecipient, {
            type: "offer",
            offer,
            name: ws.name,
          });
        } else {
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`,
          });
        }
        break;

      case "answer":
        //Check if user to send answer to exists
        const answerRecipient = users[name];
        if (!!answerRecipient) {
          sendTo(answerRecipient, {
            type: "answer",
            answer,
          });
        } else {
          sendTo(ws, {
            type: "error",
            message: `User ${name} does not exist!`,
          });
        }
        break;
    }
  });
  //send immediate a feedback to the incoming connection
  ws.send(
    JSON.stringify({
      type: "connect",
      message: "Well hello there, I am a WebSocket server",
    })
  );
});

server.listen(port, () => {
  console.log(`Signaling Server running on port: ${port}`);
});
