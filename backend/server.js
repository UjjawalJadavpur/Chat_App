import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from "cookie-parser" 

import userRoute from './Routes/userRoute.js';
import messageRoute from './Routes/messageRoute.js';
import { app, server } from "./SocketIO/socketServer.js"; 

//const app = express();

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

//app.use(cors());

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5007;
const MDB_URI = process.env.MONGODB_URI;

mongoose.connect(MDB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB:", error));


app.use("/user", userRoute);
app.use("/message",messageRoute);

// app.get('/', (req, res) => {
//     res.send("Hello World Lucifer");
// });

server.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
