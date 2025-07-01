import express from "express";
import {
  addComment,
  getCommentsForDoubt,
} from "../controllers/commentController.js";
import { protect, isMentor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:doubtId", protect, isMentor, addComment);
router.get("/:doubtId", protect, getCommentsForDoubt);

export default router;
