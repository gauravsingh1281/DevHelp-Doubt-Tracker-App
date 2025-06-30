import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  doubt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doubt",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User ",
  },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
