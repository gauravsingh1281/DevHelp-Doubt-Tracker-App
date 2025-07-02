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
    if (!doubtId) return;

    setLoading(true);
    setError(null);
    try {
      console.log("Fetching comments for doubt:", doubtId);
      const res = await apiInstance.get(`/comments/${doubtId}`);
      console.log("Comments received:", res.data);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err.message);
      if (err.response?.status === 401) {
        toast.error("Please login to view comments");
      } else {
        toast.error("Failed to fetch comments");
      }
    } finally {
      setLoading(false);
    }
  }, [doubtId]);

  // Update comment count when comments change
  useEffect(() => {
    if (onCommentsUpdate && comments.length >= 0) {
      const totalCount = comments.reduce((total, comment) => {
        return total + 1 + (comment.replies?.length || 0);
      }, 0);
      onCommentsUpdate(totalCount);
    }
  }, [comments, onCommentsUpdate]);

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
      fetchComments();
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
      fetchComments();
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
      fetchComments();
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

    return (
      <div key={comment._id} className={`ml-${depth * 4} mt-2`}>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <strong className="text-gray-800">{comment.author.name}</strong>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                comment.author.role === "mentor"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {comment.author.role === "mentor" ? "🎓 Mentor" : "👤 Student"}
            </span>
            <span className="text-gray-400 text-xs">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Comment Text or Edit Form */}
          {isEditing ? (
            <div className="mb-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm resize-none"
                rows="2"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEditComment(comment._id, editText)}
                  className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm mb-2">{comment.text}</p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 text-xs">
            {canReply && (
              <button
                onClick={() => setReplyToCommentId(comment._id)}
                className="text-blue-500 hover:text-blue-700 font-medium cursor-pointer"
              >
                ↪️ Reply
              </button>
            )}
            {isCurrentUser && !isEditing && (
              <>
                <button
                  onClick={() => startEditComment(comment)}
                  className="text-orange-500 hover:text-orange-700 font-medium cursor-pointer"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-red-500 hover:text-red-700 font-medium cursor-pointer"
                >
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
        {comment.replies?.length > 0 &&
          comment.replies.map((reply) => renderComment(reply, depth + 1))}
      </div>
    );
  };

  useEffect(() => {
    if (doubtId) {
      console.log("MentorComments useEffect triggered for doubtId:", doubtId);
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
          <div className="bg-blue-50 p-2 rounded mb-2 text-sm">
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
              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
            >
              ✖ Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={
              replyToCommentId ? "Write your reply..." : "Add a comment..."
            }
            className="flex-1 border rounded px-3 py-2 text-sm resize-none"
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
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed self-start cursor-pointer"
          >
            {replyToCommentId ? "Reply" : "Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorComments;
