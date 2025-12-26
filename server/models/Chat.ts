import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    messages: [
        {
            isImage: {
                type: Boolean,
                required: true
            },
            isPublished: {
                type: Boolean,
                required: true
            },
            role: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Number,
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat