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

// 3. Delete a chat and all its associated messages in MongoDB
async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        // Ensure user owns this chat
        const deletedChat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user._id
        });

        if (!deletedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        // Delete all messages belonging to this chat
        await messageModel.deleteMany({ chat: chatId });

        res.status(200).json({ message: "Chat and messages deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete chat", error });
    }
}

// 4. Rename a chat title in MongoDB
async function renameChat(req, res) {
    try {
        const { chatId } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title cannot be empty" });
        }

        const updatedChat = await chatModel.findOneAndUpdate(
            { _id: chatId, user: req.user._id },
            { title: title.trim() },
            { new: true }
        );

        if (!updatedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        res.status(200).json({
            message: "Chat renamed successfully",
            chat: updatedChat
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to rename chat", error });
    }
}

module.exports = {
    createChat,
    getUserChats,
    getChatMessages,
    deleteChat,
    renameChat
};