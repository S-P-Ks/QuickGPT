import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User, { type UserType } from "../models/User";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization?.split(" ")[1];

    try {
        if (!token || !process.env.JWT_SECRET) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        const decodedId = decoded.id;

        const user = await User.findById(decodedId);

        if (!user) {
            return res.json({ success: false, message: "User not authorized, user not found." })
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed." })
    }
}