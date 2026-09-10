const express = require("express");
const route = express .Router();
const chatController = require("../controller/chat.controller");
const { authUser } = require("../middleware/auth.middleware");


route.post("/chat", authUser, chatController.createChat);




module.exports =route;