import type { Request, Response } from "express";
import Chat from "../models/Chat";

export const createChat = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        console.log(req.user)

        const userId = req.user._id;

        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            username: req.user.name,
        };

        console.log("chatData")
        console.log(chatData)

        await Chat.create(chatData);
        res.json({ success: true, message: "Chat created" })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: (error as Error).message })
    }
}

export const getChats = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = req.user._id;

        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

        return res.json({ success: true, chats })
    } catch (error) {
        return res.json({ success: false, message: (error as Error).message })
    }
}

export const deleChat = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const userId = req.user._id;
        const { chatId } = req.body;

        await Chat.deleteOne({ _id: chatId, userId })

        return res.json({ success: true, message: "Chat Deleted" })
    } catch (error) {
        return res.json({ success: false, message: (error as Error).message })
    }
}