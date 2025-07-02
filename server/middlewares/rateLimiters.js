import rateLimit from "express-rate-limit";

// Limit Login Attempts: 5 per 5 minutes
export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again after 5 minutes.",
});

// Limit Registration: 3 per hour
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: "Too many accounts created. Try again after an hour.",
});

// Limit Doubt Creation: 3 per minute
export const createDoubtLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: "You can only post 3 doubts per minute.",
});

//Limit Comments/Replies: 5 per minute
export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "You’re commenting too fast. Wait a moment.",
});
