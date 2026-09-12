const express = require("express");
const route = express.Router();
const authController = require("../controller/auth.controller");
const { authUser } = require("../middleware/auth.middleware");


//define the register,login and user get routes 
route.post("/user/register",authController.registerController);
route.post("/user/login",authController.loginController);
route.get("/user", authUser, (req, res) => {
    res.status(200).json({ user: req.user });
});

module.exports = route;
