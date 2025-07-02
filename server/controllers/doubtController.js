import Doubt from "../models/Doubt.js";
import Comment from "../models/Comment.js";
import imagekit from "../utils/imagekit.js";

export const createDoubt = async (req, res) => {
  try {
    const { title, description } = req.body;
    let screenshotUrl = null;
    let screenshotFileId = null;

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/doubt-screenshots",
      });
      screenshotUrl = uploaded.url;
      screenshotFileId = uploaded.fileId;
    }

    const doubt = new Doubt({
      title,
      description,
      screenshot: screenshotUrl,
      screenshotFileId,
      student: req.user.id,
    });

    await doubt.save();
    res.status(201).json(doubt);
  } catch (err) {
    console.error("Create Doubt Error:", err);
    res.status(500).json({ msg: "Failed to create doubt", error: err.message });
  }
};

export const getMyDoubts = async (req, res) => {
  try {
    const doubts = await Doubt.find({ student: req.user.id }).sort({
      createdAt: -1,
    });

    // Get comment counts for each doubt (including replies)
    const doubtsWithCommentCount = await Promise.all(
      doubts.map(async (doubt) => {
        // Count all comments and replies for this doubt
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

    // Get comment counts for each doubt (including replies)
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

export const updateDoubt = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, existingScreenshot } = req.body;

    const existingDoubt = await Doubt.findOne({
      _id: id,
      student: req.user.id,
    });

    if (!existingDoubt) {
      return res.status(404).json({ msg: "Not found or unauthorized" });
    }

    let newScreenshotUrl = existingDoubt.screenshot;
    let newScreenshotFileId = existingDoubt.screenshotFileId;

    // Handle new file upload
    if (req.file) {
      // Delete old screenshot from ImageKit if it exists
      if (existingDoubt.screenshotFileId) {
        try {
          await imagekit.deleteFile(existingDoubt.screenshotFileId);
        } catch (deleteErr) {
          console.warn("Failed to delete old screenshot:", deleteErr);
        }
      }

      // Upload new screenshot
      const uploaded = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/doubt-screenshots",
      });
      newScreenshotUrl = uploaded.url;
      newScreenshotFileId = uploaded.fileId;
    } else if (!existingScreenshot && existingDoubt.screenshotFileId) {
      // If no existing screenshot is provided and no new file, remove the screenshot
      try {
        await imagekit.deleteFile(existingDoubt.screenshotFileId);
      } catch (deleteErr) {
        console.warn("Failed to delete screenshot:", deleteErr);
      }
      newScreenshotUrl = null;
      newScreenshotFileId = null;
    }

    existingDoubt.title = title || existingDoubt.title;
    existingDoubt.description = description || existingDoubt.description;
    existingDoubt.screenshot = newScreenshotUrl;
    existingDoubt.screenshotFileId = newScreenshotFileId;
    existingDoubt.updatedAt = Date.now();

    await existingDoubt.save();

    res.json(existingDoubt);
  } catch (err) {
    console.error("Update doubt error:", err);
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};

export const deleteDoubt = async (req, res) => {
  try {
    const { id } = req.params;

    const doubt = await Doubt.findOne({ _id: id, student: req.user.id });

    if (!doubt) {
      return res.status(404).json({ msg: "Not found or unauthorized" });
    }

    // If image exists, delete from ImageKit
    if (doubt.screenshotFileId) {
      await imagekit.deleteFile(doubt.screenshotFileId);
    }

    await doubt.deleteOne();

    res.json({ msg: "Doubt deleted successfully" });
  } catch (err) {
    console.error("Delete Doubt Error:", err);
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

// New function for both students and mentors to toggle resolve status
export const toggleDoubtStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // First find the doubt to check current status
    const doubt = await Doubt.findById(id);
    if (!doubt) {
      return res.status(404).json({ msg: "Doubt not found" });
    }

    // Check authorization
    if (
      req.user.role === "student" &&
      doubt.student.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ msg: "Students can only toggle their own doubts" });
    }
    // Mentors can toggle any doubt (no additional check needed)

    // Toggle status
    const newStatus = doubt.status === "resolved" ? "open" : "resolved";

    const updated = await Doubt.findByIdAndUpdate(
      id,
      { status: newStatus, updatedAt: Date.now() },
      { new: true }
    ).populate("student", "name email");

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Failed to toggle doubt status", error: err.message });
  }
};
