import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from 'cors';
import { Socket } from "socket.io-client";
import User from "../Models/userModel.js";



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


  socket.on("disconnect", async() => {
    console.log("User Disconnected : ", socket.id);
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));

    try {
      if (userId) {
          await User.findByIdAndUpdate(userId, {
              lastSeen: new Date() 
          });
      }   
    } catch (error) {
      console.error("Error updating last seen:", error);
    }
  });
});

export { app, server, io };