import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { doubtId } = req.params;

    const comment = new Comment({
      text,
      doubt: doubtId,
      author: req.user.id,
    });

    await comment.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: "Failed to post comment", error: err.message });
  }
};

export const getCommentsForDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;

    const comments = await Comment.find({ doubt: doubtId })
      .populate("author", "name role")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get comments", error: err.message });
  }
};
