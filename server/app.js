//here require express package and create server 
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./route/auth.route");
const chatRoute = require("./route/chat.route");

//this is a middleware that pass the data coming from client side to the server side in req.body
app.use(express.json());
//this middleware of express that parse the cookies in specific location like browser
app.use(cookieParser());

//define the root routes
app.use("/api",authRoute);
app.use("/api/create",chatRoute);

module.exports = app;