const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./route/auth.route");
const chatRoute = require("./route/chat.route");

// 1. Enable CORS first
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// 2. Body & Cookie parsers
app.use(express.json());
app.use(cookieParser());

// 3. Mount Routes
app.use("/api", authRoute);
app.use("/api/create", chatRoute);

module.exports = app;