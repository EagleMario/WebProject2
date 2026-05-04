const { GoogleGenerativeAI } = require("@google/generative-ai");
const { OpenAI } = require("openai");

const AppError = require('../Utils/appError.js');
const catchasync = require('../Utils/CatchAsync.js');

exports.handleAIChat = catchasync(async (req, res, next) => {
    const { message, provider } = req.body;
    const systemPrompt = "You are an AI assistant for a school management system.";

    if (provider === 'gpt') {
        if (!process.env.OPENAI_API_KEY) return next(new AppError("OpenAI API Key missing", 500));
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });
        return res.status(200).json({ success: true, provider, reply: completion.choices[0].message.content });

    } else if (provider === 'gemini') {
        if (!process.env.GEMINI_API_KEY) return next(new AppError("Gemini API Key missing", 500));
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(message);
        return res.status(200).json({ success: true, provider, reply: result.response.text() });

    } else {
        return next(new AppError("Please select a valid AI provider (gpt or gemini)", 400));
    }
});
