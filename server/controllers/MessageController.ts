import type { Request, Response } from "express"
import User, { type UserDocument } from "../models/User"
import Chat from "../models/Chat"
import openai from "../configs/openai";
import axios from "axios"
import imagekit from "../configs/imageKit";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument;
        }
    }
}

export const textMessageController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature."
            })
        }

        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        chat?.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false,
            isPublished: true
        })

        const response = await openai.chat.completions.create({
            model: "gemini-2.5-flash-lite",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const { choices } = response;

        console.log(choices)

        const reply = {
            ...choices[0]!.message, timestamp: Date.now(),
            isImage: false,
            isPublished: true
        }

        chat?.messages.push(reply)
        await chat?.save();

        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
        res.json({ success: true, reply })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: (error as Error).message })
    }
}

export const imageMessageController = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const userId = req.user._id;

        if (req.user.credits < 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature."
            })
        }

        const { chatId, prompt, isPublished } = req.body;
        const chat = await Chat.findOne({ userId, _id: chatId });
        chat?.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: true
        })

        const encodedPrompt = encodeURIComponent(prompt);
        const generatedImageKitUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;
        const aiImageResponse = await axios.get(generatedImageKitUrl, {
            responseType: "arraybuffer"
        })

        console.log("encodedPrompt", encodedPrompt)
        console.log("aiImageResponse", aiImageResponse.data)

        const base64Img = Buffer.from(aiImageResponse.data, "binary").toString("base64");

        const uploadResponse = await imagekit.upload({
            file: base64Img,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        });

        const reply = {
            role: "assistant",
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }

        res.json({
            success: true, reply
        })

        chat?.messages.push(reply)
        await chat?.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: (error as Error).message })
    }
}