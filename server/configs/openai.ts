import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY || "AIzaSyC_yDTboNj8sjSUYSR4FTX6rDxJ5iFMuNU",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export default openai