import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateAuth } from "../middlewares/validators.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();

router.post("/register", registerLimiter, validateAuth, registerUser);
router.post("/login", loginLimiter, loginUser);

export default router;
