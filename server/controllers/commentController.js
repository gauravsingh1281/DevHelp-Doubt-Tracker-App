// controllers/commentController.js
import Comment from "../models/Comment.js";
import Doubt from "../models/Doubt.js";

// POST: Add a comment or reply
export const addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;
    const { doubtId } = req.params;

    const comment = new Comment({
      text,
      doubt: doubtId,
      author: req.user.id,
      parentComment: parentComment || null,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: "Failed to post comment", error: err.message });
  }
};

// GET: Nested comments for a doubt
export const getCommentsForDoubt = async (req, res) => {
  try {
    const { doubtId } = req.params;

    const allComments = await Comment.find({ doubt: doubtId })
      .populate("author", "name role")
      .sort({ createdAt: 1 })
      .lean();

    const commentMap = {};
    const rootComments = [];

    allComments.forEach((c) => {
      c.replies = [];
      commentMap[c._id.toString()] = c;
    });

    allComments.forEach((c) => {
      if (c.parentComment) {
        const parent = commentMap[c.parentComment.toString()];
        if (parent) parent.replies.push(c);
      } else {
        rootComments.push(c);
      }
    });

    res.json(rootComments);
  } catch (err) {
    res.status(500).json({ msg: "Failed to get comments", error: err.message });
  }
};

// PATCH: Edit a comment
export const editComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (String(comment.author) !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    comment.text = req.body.text;
    await comment.save();

    res.json({ msg: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ msg: "Edit failed", error: err.message });
  }
};

// DELETE: Remove a comment and its nested replies
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (String(comment.author) !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    // Recursively delete all child replies
    const deleteRecursively = async (parentId) => {
      const children = await Comment.find({ parentComment: parentId });
      for (const child of children) {
        await deleteRecursively(child._id);
        await child.deleteOne();
      }
    };

    await deleteRecursively(comment._id);
    await comment.deleteOne();

    res.json({ msg: "Comment and its replies deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};
