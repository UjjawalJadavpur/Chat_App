import Conversation from '../Models/conversationModel.js';
import Message from "../Models/messageModel.js";
import { getReceiverSocketId } from '../SocketIO/socketServer.js';
import { io } from '../SocketIO/socketServer.js';

export const sendMessage = async(req,res) => {
    console.log("Message sent",req.params.id,req.body.message);

    try{
        const {message} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id; //logged in user

        let conversation = await Conversation.findOne({
            members : {$all : [senderId, receiverId]}
        });

        if(!conversation){
            conversation = await Conversation.create({
               members: [senderId, receiverId],             
            });
        }
        const newMessage = new Message({
            senderId, receiverId, message,
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]);
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage" , newMessage)
            console.log("io to recever socket :::");
            console.log("newMessage: ",newMessage);
        }
        res.status(201).json({
            message: "Message sent successfully",
            newMessage
        });
    }
    catch (error) {
        console.log("Error in sendMessage", error);
        res.status(500).json({ error: "Internal server error" });
    }

};

export const getMessage = async (req,res) => {
    try{
        const { id: chatUser } = req.params;
        const senderId = req.user._id;
        
        let conversation = await Conversation.findOne ({
            members : { $all : [senderId, chatUser] },
        }).populate("messages");

        // console.log("conversation messages Found: - ", conversation ? conversation.messages : "No conversation found");

        if(!conversation ) {
            console.log("No conversation found, returning empty array.");
            return res.status(200).json([]);
        }
        const messages = conversation.messages  || [];
        res.status(200).json(messages);

    } catch (error) {
        console.log ("Error in getMessage API:-  ", error);
        res.status(500).json({ error : "Internal Server error"});
    }
}

export const deleteMessageForMe = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
    
        // const alreadyDeletedForUser = message.deleteFlags.some(
        //     (flag) => flag.userId.toString() === userId.toString() && flag.type === "forMe"
        // );

        // if (alreadyDeletedForUser) {
        //     return res.status(200).json({ message: "Message already hidden for you" });
        // }

        
        message.deleteFlags.push({ userId, type: "forMe" });
        await message.save();

        io.to(getReceiverSocketId(userId)).emit("messageDeleted", {
            messageId,
            deleteFlags: message.deleteFlags,
        });

        res.status(200).json({ message: "Message deleted for you" });
    } catch (error) {
        console.log("Error in deleteMessageForMe", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const deleteMessageForEveryone = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // if (message.senderId.toString() !== userId.toString()) {
        //     return res.status(403).json({ error: "You are not authorized to delete this message for everyone" });
        // }

        message.deleteFlags.push({ userId, type: "forEveryone" });
        await message.save();

        const conversation = await Conversation.findOne({ messages: messageId });

        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        io.emit("messageDeleted", {
            messageId,
            conversationId: conversation._id, 
            deleteFlags: message.deleteFlags,
        });

        res.status(200).json({ message: "Message deleted for everyone" });
    } catch (error) {
        console.log("Error in deleteMessageForEveryone", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

