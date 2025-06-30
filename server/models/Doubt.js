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
  status: {
    type: String,
    enum: ["open", "resolved"],
    default: "open",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User ",
  },
});
const Doubt = mongoose.model("Doubt", doubtSchema);
export default Doubt;
