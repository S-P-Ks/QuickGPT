import type { Request, Response } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken"
import type mongoose from "mongoose";
import bcrypt from "bcrypt"
import Chat from "../models/Chat";

export const generateToken = async (id: mongoose.Types.ObjectId) => {
    return await jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d'
    })
}

export const registerUser = async function (req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.json({
                success: false,
                message: "User already exists."
            })
        }

        const user = await User.create({
            name, email, password
        });

        const token = await generateToken(user._id);

        console.log(token)

        res.json({
            success: true,
            token
        })
    } catch (error) {
        return res.json({ success: false, message: (error as Error).message })
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                const token = await generateToken(user._id);
                return res.json({ success: true, token })
            }
        }

        return res.json({ success: false, message: "Invalid email or password" })
    } catch (error) {
        return res.json({ success: false, message: (error as Error).message })
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        return res.json({ success: true, user })
    } catch (error) {
        return res.json({ success: false, message: (error as Error).message })
    }
}

export const getPublishedImages = async (req: Request, res: Response) => {
    try {
        const publihsedImageMessages = await Chat.aggregate([{
            $unwind: "$messages"
        }, {
            $match: {
                "messages.isImage": true,
                "messages.isPublished": true
            }
        }, {
            $project: {
                _id: 0,
                imageUrl: "$messages.content",
                userName: "$userName"
            }
        }]);

        res.json({
            success: true,
            images: publihsedImageMessages.reverse()
        })
    } catch (error) {
        return res.json({ success: false, message: (error as Error).message })
    }
}