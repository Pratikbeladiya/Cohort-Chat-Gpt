const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./route/auth.route");
const chatRoute = require("./route/chat.route");


app.use(express.json());
app.use(cookieParser());

app.use("/api",authRoute);
app.use("/api/create",chatRoute);

module.exports = app;