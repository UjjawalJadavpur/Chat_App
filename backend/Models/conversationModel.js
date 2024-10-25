import mongoose from "mongoose";
import Message from "./messageModel.js";
import User from "./userModel.js";

const conversationSchema = new mongoose.Schema({
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
        }
    ],
    messages: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:Message,
            default: []
        }
    ]
},{timestamps: true})

const Conversation = mongoose.model("conversation",conversationSchema)
export default Conversation;