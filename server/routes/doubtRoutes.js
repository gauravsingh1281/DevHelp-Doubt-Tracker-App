import express from "express";
import multer from "multer";
import {
  createDoubt,
  getMyDoubts,
  getAllDoubts,
  updateDoubt,
  deleteDoubt,
  markDoubtResolved,
  toggleDoubtStatus,
} from "../controllers/doubtController.js";

import { protect, isStudent, isMentor } from "../middlewares/authMiddleware.js";
import { createDoubtLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Student Routes
router.post(
  "/",
  protect,
  isStudent,
  createDoubtLimiter,
  upload.single("screenshot"),
  createDoubt
);
router.get("/my", protect, isStudent, getMyDoubts);
router.patch(
  "/:id",
  protect,
  isStudent,
  upload.single("screenshot"),
  updateDoubt
);
router.delete("/:id", protect, isStudent, deleteDoubt);
router.patch("/:id/resolve", protect, isStudent, markDoubtResolved);

// Mentor Routes
router.get("/", protect, isMentor, getAllDoubts);

// Shared Routes (Students and Mentors)
router.patch("/:id/toggle-status", protect, toggleDoubtStatus);

export default router;
