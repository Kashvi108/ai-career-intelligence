const express = require('express');
const authcontroller = require('../controller/auth.controller');  // ✅ Same rakha

const authMiddleware = require("../middlewares/auth.middleware")

const authrouter = express.Router()

authrouter.post("/register", authcontroller.registerUserController)  // ✅ Fix: controller attach kiya

authrouter.post("/login", authcontroller.loginUserController)

authrouter.get("/logout", authcontroller.logoutUserController)

authrouter.get("/get-me", authMiddleware.authUser, authcontroller.getMeController)

module.exports = authrouter