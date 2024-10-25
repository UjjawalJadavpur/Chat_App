import express from "express";
import { getMessage, sendMessage, deleteMessageForEveryone, deleteMessageForMe } from "../Controller/messageController.js";
import secureRoute from "../Middleware/secureRoute.js";

const router = express.Router()
router.post("/send/:id", secureRoute, sendMessage);
router.get("/get/:id", secureRoute, getMessage);
router.delete("/deleteForMe/:messageId", secureRoute, deleteMessageForMe);
router.delete("/deleteForEveryone/:messageId", secureRoute, deleteMessageForEveryone);

export default router;