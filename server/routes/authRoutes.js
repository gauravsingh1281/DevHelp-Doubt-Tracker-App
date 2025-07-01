import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validateAuth } from "../middlewares/validators.js";

const router = express.Router();

router.post("/register", validateAuth, registerUser);
router.post("/login", loginUser);

export default router;
