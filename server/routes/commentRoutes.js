import express from "express";
import {
  addComment,
  getCommentsForDoubt,
  editComment,
  deleteComment,
} from "../controllers/commentController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Allow both mentors and students to comment
router.post("/:doubtId", protect, addComment);

// Fetch all nested comments for a doubt
router.get("/:doubtId", protect, getCommentsForDoubt);

// Edit own comment
router.patch("/:commentId", protect, editComment);

// Delete own comment
router.delete("/:commentId", protect, deleteComment);

export default router;
