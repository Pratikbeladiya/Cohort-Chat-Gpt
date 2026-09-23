const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../model/auth.model");
const messageModel = require("../model/message.model");
const aiService = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: function (origin, callback) {
                if (!origin || origin.includes("localhost") || origin.endsWith(".vercel.app") || origin === process.env.CLIENT_URL) {
                    callback(null, true);
                } else {
                    callback(null, true);
                }
            },
            credentials: true
        }
    });

    // Socket auth middleware
    io.use(async (socket, next) => {
        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
           const token = cookies.token || socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            socket.user = user;
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", async (socket) => {
        socket.on("ai-message", async (messagePayload) => {
            try {
                // 1. Parse incoming payload
                const payload = typeof messagePayload === "string" ? JSON.parse(messagePayload) : messagePayload;
                console.log("Received payload: ", payload);

                // 2. Save user message and generate vector concurrently
                const [message, vectors] = await Promise.all([
                    messageModel.create({
                        chat: payload.chat,
                        role: "user",
                        user: socket.user._id,
                        content: payload.content
                    }),
                    aiService.generateVector(payload.content)
                ]);

                // 3. Store vector in Pinecone
                if (vectors && message._id) {
                    await createMemory({
                        id: message._id.toString(),
                        vectors,
                        metadata: {
                            chat: payload.chat,
                            user: socket.user._id.toString(),
                            text: payload.content,
                            role: "user"
                        }
                    });
                    console.log("User vector stored in Pinecone:", message._id);
                }

                // 4. Query long-term memory & fetch short-term chat history
                const [memory, chatHistory] = await Promise.all([
                    queryMemory({
                        queryVector: vectors,
                        limit: 3,
                        metadata: {
                            user: socket.user._id.toString()
                        }
                    }),
                    messageModel.find({
                        chat: payload.chat
                    }).sort({ createdAt: 1 }).limit(20).lean()
                ]);

                // Short-term memory formatted for Gemini
                const stm = (chatHistory || []).map(item => ({
                    role: item.role,
                    parts: [{ text: item.content }]
                }));

                // Long-term memory context formatted for Gemini
                const memoryText = (memory || [])
                    .map(item => item.metadata?.text || '')
                    .filter(Boolean)
                    .join("\n");

                const ltm = memoryText ? [
                    {
                        role: "user",
                        parts: [{ text: `Relevant past conversation background:\n${memoryText}` }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I will use this background to help answer." }]
                    }
                ] : [];

                // 5. Generate AI response from combined context
                const fullHistory = [...ltm, ...stm];
                const response = await aiService.generateResponse(fullHistory);

                // 6. Emit AI response back to client immediately
                socket.emit("ai-response", {
                    content: response,
                    chat: payload.chat
                });

                // 7. Save model response and its vector
                const [responseMessage, responseVectors] = await Promise.all([
                    messageModel.create({
                        chat: payload.chat,
                        user: socket.user._id,
                        content: response,
                        role: "model"
                    }),
                    aiService.generateVector(response)
                ]);

                if (responseVectors && responseMessage._id) {
                    await createMemory({
                        id: responseMessage._id.toString(),
                        vectors: responseVectors,
                        metadata: {
                            chat: payload.chat,
                            user: socket.user._id.toString(),
                            text: response,
                            role: "model"
                        }
                    });
                    console.log("Model vector stored in Pinecone:", responseMessage._id);
                }


            } catch (err) {
                console.error("Error handling ai-message: ", err);
            }
        });
    });
}

module.exports = initSocketServer;