import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ msg: "Access denied. Students only." });
  }
  next();
};

export const isMentor = (req, res, next) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({ msg: "Access denied. Mentors only." });
  }
  next();
};
