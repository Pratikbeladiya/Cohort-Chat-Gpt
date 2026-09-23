const chatModel = require("../model/chat.model");
const messageModel = require("../model/message.model");

// Create a new chat
async function createChat(req, res) {
    try {
        const { title } = req.body;
        const user = req.user;

        const chat = await chatModel.create({
            user: user._id,
            title: title || "New Chat"
        });

        res.status(201).json({
            message: "Chat created successfully",
            chat
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create chat", error });
    }
}

// 1. Get all chats belonging to the logged-in user
async function getUserChats(req, res) {
    try {
        const chats = await chatModel.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch chats", error });
    }
}

// 2. Get all messages of a specific chat
async function getChatMessages(req, res) {
    try {
        const { chatId } = req.params;
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch messages", error });
    }
}

module.exports = {
    createChat,
    getUserChats,
    getChatMessages
};