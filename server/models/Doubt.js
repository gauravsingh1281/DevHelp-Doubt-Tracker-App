import mongoose from "mongoose";

const doubtSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  screenshot: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open",
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
const Doubt = mongoose.model("Doubt", doubtSchema);
export default Doubt;
