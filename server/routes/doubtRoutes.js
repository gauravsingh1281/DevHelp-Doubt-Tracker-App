import express from "express";
import {
  createDoubt,
  getMyDoubts,
  getAllDoubts,
  updateDoubt,
  deleteDoubt,
  markDoubtResolved,
} from "../controllers/doubtController.js";

import { protect, isStudent, isMentor } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student Routes
router.post("/", protect, isStudent, createDoubt);
router.get("/my", protect, isStudent, getMyDoubts);
router.patch("/:id", protect, isStudent, updateDoubt);
router.delete("/:id", protect, isStudent, deleteDoubt);
router.patch("/:id/resolve", protect, isStudent, markDoubtResolved);

// Mentor Routes
router.get("/", protect, isMentor, getAllDoubts);

export default router;
