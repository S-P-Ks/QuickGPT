import express from "express"
import { createChat, getChats, deleChat } from "../controllers/ChatController";
import { protect } from "../middlewares/auth";

const chatRouter = express.Router();

chatRouter.post("/create", protect, createChat)
chatRouter.get("/get", protect, getChats)
chatRouter.delete("/delete", protect, deleChat)

export default chatRouter