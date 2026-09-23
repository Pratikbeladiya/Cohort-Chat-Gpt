const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./route/auth.route");
const chatRoute = require("./route/chat.route");

app.use(cors({
  origin: function (origin, callback) {
    // Allows localhost, your custom CLIENT_URL, and any Vercel deployment preview/production URL
    if (
      !origin ||
      origin.includes("localhost") ||
      origin.endsWith(".vercel.app") ||
      origin === process.env.CLIENT_URL
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// 2. Body & Cookie parsers
app.use(express.json());
app.use(cookieParser());

// 3. Mount Routes
app.use("/api", authRoute);
app.use("/api/create", chatRoute);

module.exports = app;