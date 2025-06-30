import express from "express";
import connectDB from "./config/db.js";
const app = express();
const PORT = 3000;

connectDB();
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});
