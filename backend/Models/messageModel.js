import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    deleteFlags: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            type: { type: String, enum: ["forMe", "forEveryone"], required: true },
        }
    ],
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;