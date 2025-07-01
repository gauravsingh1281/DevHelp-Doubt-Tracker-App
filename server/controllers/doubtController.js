import Doubt from "../models/Doubt.js";
import Comment from "../models/Comment.js";

export const createDoubt = async (req, res) => {
  try {
    const { title, description, screenshot } = req.body;

    const doubt = new Doubt({
      title,
      description,
      screenshot,
      student: req.user.id,
    });

    await doubt.save();
    res.status(201).json(doubt);
  } catch (err) {
    res.status(500).json({ msg: "Failed to create doubt", error: err.message });
  }
};

export const getMyDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ student: req.user.id }).sort({
      createdAt: -1,
    });

    // Get comment counts for each doubt
    const doubtsWithCommentCount = await Promise.all(
      doubts.map(async (doubt) => {
        const commentCount = await Comment.countDocuments({ doubt: doubt._id });
        return {
          ...doubt.toObject(),
          commentCount,
        };
      })
    );

    res.json(doubtsWithCommentCount);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching doubts", error: err.message });
  }
};

export const getAllDoubts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const doubts = await Doubt.find(filter)
      .populate("student", "name email")
      .sort({ createdAt: -1 });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching doubts", error: err.message });
  }
};

export const updateDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Doubt.findOneAndUpdate(
      { _id: id, student: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ msg: "Not found or unauthorized" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

export const deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Doubt.findOneAndDelete({
      _id: id,
      student: req.user.id,
    });

    if (!deleted)
      return res.status(404).json({ msg: "Not found or unauthorized" });

    res.json({ msg: "Doubt deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed", error: err.message });
  }
};

export const markDoubtResolved = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Doubt.findOneAndUpdate(
      { _id: id, student: req.user.id },
      { status: "resolved", updatedAt: Date.now() },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ msg: "Doubt not found or unauthorized" });

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to mark as resolved", error: err.message });
  }
};
