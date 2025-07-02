import { useEffect, useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";
import { AuthContext } from "../context/AuthContext";

const MentorComments = ({ doubtId, onCommentsUpdate }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchComments = useCallback(async () => {
    if (!doubtId) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await apiInstance.get(`/comments/${doubtId}`);
      setComments(res.data || []);
    } catch (err) {
      setError(err.message);
      setComments([]); // Reset comments on error

      if (err.response?.status === 401) {
        toast.error("Please login to view comments");
      } else if (err.response?.status === 404) {
        toast.error("Comments not found");
      } else if (err.response?.status === 403) {
        toast.error("Access denied");
      } else {
        toast.error(
          "Failed to fetch comments: " +
            (err.response?.data?.msg || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  }, [doubtId]);

  // Recursive function to count all comments and nested replies
  const countCommentsRecursively = useCallback((comments) => {
    return comments.reduce((total, comment) => {
      // Count the comment itself + all its nested replies
      let count = 1; // The comment itself
      if (comment.replies && Array.isArray(comment.replies)) {
        count += countCommentsRecursively(comment.replies); // Recursively count nested replies
      }
      return total + count;
    }, 0);
  }, []);

  // Update comment count when comments change
  useEffect(() => {
    if (onCommentsUpdate && Array.isArray(comments)) {
      const totalCount = countCommentsRecursively(comments);

      try {
        onCommentsUpdate(totalCount);
      } catch (error) {
        console.error("Error updating comment count:", error);
      }
    }
  }, [comments, onCommentsUpdate, doubtId, countCommentsRecursively]);

  const handleAddComment = async () => {
    if (!replyText.trim()) return;
    try {
      await apiInstance.post(`/comments/${doubtId}`, {
        text: replyText,
        parentComment: replyToCommentId || null,
      });
      toast.success("Comment added");
      setReplyText("");
      setReplyToCommentId(null);
      await fetchComments(); // Fetch updated comments
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = async (commentId, newText) => {
    if (!newText.trim()) return;
    try {
      await apiInstance.patch(`/comments/${commentId}`, {
        text: newText,
      });
      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditText("");
      await fetchComments(); // Fetch updated comments
    } catch (err) {
      console.error("Error editing comment:", err);
      toast.error("Failed to edit comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    try {
      await apiInstance.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      await fetchComments(); // Fetch updated comments
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditText("");
  };

  const renderComment = (comment, depth = 0) => {
    const isCurrentUser = user && comment.author._id === user.id;
    const canReply = user && comment.author._id !== user.id; // Users cannot reply to their own comments
    const isEditing = editingCommentId === comment._id;
    const isReply = depth > 0;

    return (
      <div
        key={comment._id}
        className={`${isReply ? "ml-4 lg:ml-8 mt-3" : "mt-3"}`}
      >
        <div
          className={`p-3 lg:p-4 rounded-lg border-l-4 ${
            isReply
              ? "bg-blue-50 border-l-blue-400 border border-blue-200"
              : "bg-gray-50 border-l-gray-400 border border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            {/* Comment/Reply Type Indicator */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  isReply
                    ? "bg-blue-200 text-blue-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {isReply ? "↪️ Reply" : "💬 Comment"}
              </span>

              <strong className="text-gray-800 text-sm lg:text-base break-words">
                {comment.author.name}
              </strong>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  comment.author.role === "mentor"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {comment.author.role === "mentor" ? "🎓 Mentor" : "👤 Student"}
              </span>
              <span className="text-gray-400 text-xs whitespace-nowrap">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Comment Text or Edit Form */}
          {isEditing ? (
            <div className="mb-2">
              <label className="block text-xs text-gray-600 mb-1">
                Editing {isReply ? "reply" : "comment"}:
              </label>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder={`Update your ${isReply ? "reply" : "comment"}...`}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditComment(comment._id, editText)}
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  💾 Save {isReply ? "Reply" : "Comment"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-xs bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`${isReply ? "pl-4 border-l-2 border-blue-300" : ""}`}
            >
              <p className="text-gray-700 text-sm leading-relaxed">
                {comment.text}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 text-xs mt-3 pt-2 border-t border-gray-200">
            {canReply && (
              <button
                onClick={() => setReplyToCommentId(comment._id)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors text-left"
              >
                ↪️ Reply to {isReply ? "reply" : "comment"}
              </button>
            )}
            {isCurrentUser && !isEditing && (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => startEditComment(comment)}
                  className="flex items-center gap-1 text-orange-600 hover:text-orange-800 font-medium cursor-pointer transition-colors text-left"
                >
                  ✏️ Edit {isReply ? "reply" : "comment"}
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium cursor-pointer transition-colors text-left"
                >
                  🗑️ Delete {isReply ? "reply" : "comment"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Render nested replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (doubtId) {
      fetchComments();
    }
  }, [doubtId, fetchComments]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-gray-400 text-sm">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-4">
        <p className="text-red-500 text-sm">Error loading comments: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comments List */}
      <div className="space-y-2">
        {comments.length > 0 ? (
          comments.map((comment) => renderComment(comment))
        ) : (
          <p className="italic text-gray-500 text-sm">
            No comments yet. Start the discussion!
          </p>
        )}
      </div>

      {/* Add Comment Section */}
      <div className="border-t pt-4">
        {replyToCommentId && (
          <div className="bg-blue-50 p-3 rounded mb-3 text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-blue-600">
                Replying to:{" "}
                {(() => {
                  // Find the comment being replied to
                  const findComment = (comments, id) => {
                    for (const comment of comments) {
                      if (comment._id === id) return comment;
                      if (comment.replies) {
                        const found = findComment(comment.replies, id);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  const replyTarget = findComment(comments, replyToCommentId);
                  return replyTarget?.author?.name || "comment";
                })()}
              </span>
              <button
                onClick={() => setReplyToCommentId(null)}
                className="text-red-500 hover:text-red-700 cursor-pointer self-start sm:ml-auto"
              >
                ✖ Cancel Reply
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              replyToCommentId ? "Write your reply..." : "Add a comment..."
            }
            className="flex-1 border rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            onClick={handleAddComment}
            disabled={!replyText.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-start cursor-pointer transition-colors"
          >
            {replyToCommentId ? "Post Reply" : "Post Comment"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to post, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default MentorComments;
