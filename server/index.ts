import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db";
import userRouter from "./routes/userRoute";
import chatRouter from "./routes/chatRoute";
import messageRouter from "./routes/messsageRoute"
import creditRouter from "./routes/creditRoute";
import { stripeWebhooks } from "./controllers/webhooks";

const app = express();
await connectDB()

app.use(cors())
app.use(express.json())

app.post("/api/stripe", express.raw({ type: "application/json" }), stripeWebhooks)

app.get("/", (req, res) => {
    res.send("Server is live.")
})
app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/message", messageRouter)
app.use("/api/credit", creditRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})