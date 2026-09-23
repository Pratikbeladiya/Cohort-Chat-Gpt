const express = require("express");
const route = express.Router();
const chatController = require("../controller/chat.controller");
const { authUser } = require("../middleware/auth.middleware");

// Routes mounted at /api/create
route.post("/chat", authUser, chatController.createChat);
route.get("/chats", authUser, chatController.getUserChats);
route.get("/messages/:chatId", authUser, chatController.getChatMessages);
route.delete("/chat/:chatId", authUser, chatController.deleteChat);
route.patch("/chat/:chatId", authUser, chatController.renameChat);

module.exports = route;