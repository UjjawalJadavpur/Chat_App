import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from 'cors';
import { Socket } from "socket.io-client";


const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
}


io.on("connection", (socket) => {
  console.log("User Connected : ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
    console.log("Hello Users Connected:", users);
  }

  io.emit("getOnlineUsers", Object.keys(users));

  // socket.on("deleteMessageForMe", ({ messageId, userId }) => {
  //   // Emit deletion update to the specific user who initiated "delete for me"
  //   if (users[userId]) {
  //     io.to(users[userId]).emit("messageDeletedForMe", {
  //       messageId,
  //       userId,
  //       type: 'forMe'
  //     });
  //   }
  // });

  // socket.on("deleteMessageForEveryone", ({ messageId, conversationId }) => {
  //   // Emit deletion update to all users in the conversation
  //   io.emit("messageDeletedForEveryone", {
  //     messageId,
  //     conversationId,
  //     type: 'forEveryone'
  //   });
  // });


  socket.on("disconnect", () => {
    console.log("User Disconnected : ", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, server, io };