// imports
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";
import { AuthContext } from "../context/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      const res = await apiInstance.get("/doubts/my");
      setDoubts(res.data);
    } catch {
      toast.error("Failed to load doubts");
    }
  };

  const fetchComments = async (doubtId) => {
    setLoadingComments(true);
    try {
      const res = await apiInstance.get(`/comments/${doubtId}`);
      setComments(res.data);
    } catch {
      toast.error("Failed to fetch comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleOpenOverlay = (doubt) => {
    setSelectedDoubt(doubt);
    fetchComments(doubt._id);
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await apiInstance.post(`/comments/${selectedDoubt._id}`, {
        text: replyText,
        parentComment: replyToCommentId || null,
      });
      toast.success("Reply added");
      setReplyText("");
      setReplyToCommentId(null);
      fetchComments(selectedDoubt._id);
    } catch (err) {
      console.error("Reply error:", err);
      toast.error("Failed to post reply");
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    try {
      await apiInstance.patch(`/comments/${editingCommentId}`, {
        text: editText,
      });
      toast.success("Comment updated");
      setEditingCommentId(null);
      setEditText("");
      fetchComments(selectedDoubt._id);
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to edit comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await apiInstance.delete(`/comments/${commentId}`);
      toast.success("Comment deleted");
      fetchComments(selectedDoubt._id);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete comment");
    }
  };

  const handleToggleResolve = async () => {
    try {
      await apiInstance.patch(`/doubts/${selectedDoubt._id}/toggle-status`);
      const newStatus =
        selectedDoubt.status === "resolved" ? "open" : "resolved";
      const statusText = newStatus === "resolved" ? "resolved" : "reopened";
      toast.success(`Doubt marked as ${statusText}`);
      setSelectedDoubt(null);
      fetchDoubts();
    } catch {
      toast.error("Failed to update doubt status");
    }
  };

  const renderComment = (comment, depth = 0) => (
    <div key={comment._id} className={`ml-${depth * 4} mt-2`}>
      <div className="bg-gray-100 p-3 rounded-lg text-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
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
          {/* Only show edit/delete for user's own comments */}
          {user && comment.author._id === user.id && (
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  setEditingCommentId(comment._id);
                  setEditText(comment.text);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-red-600 hover:text-red-800"
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>
        {editingCommentId === comment._id ? (
          <div className="mt-2 flex gap-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="border rounded px-2 py-1 text-sm w-full resize-none"
              rows="2"
            />
            <div className="flex flex-col gap-1">
              <button
                onClick={handleEdit}
                className="text-green-600 hover:text-green-800 text-xs"
              >
                💾 Save
              </button>
              <button
                onClick={() => {
                  setEditingCommentId(null);
                  setEditText("");
                }}
                className="text-gray-600 hover:text-gray-800 text-xs"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-700">{comment.text}</p>
        )}
        {/* Only show reply button if the comment is not from the current user */}
        {user && comment.author._id !== user.id && (
          <button
            onClick={() => {
              setReplyToCommentId(comment._id);
            }}
            className="text-xs text-blue-500 mt-2 hover:text-blue-700 font-medium"
          >
            ↪️ Reply
          </button>
        )}
      </div>
      {comment.replies?.length > 0 &&
        comment.replies.map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  const filteredDoubts = doubts.filter((d) =>
    statusFilter === "all" ? true : d.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white p-6 border-r shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl mb-6 bg-orange-100 text-orange-600 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold mb-6">My Doubts</h1>
        <h2 className="text-lg font-bold mb-4">Status</h2>
        <div className="space-y-2 mb-6">
          {["all", "open", "resolved"].map((val) => (
            <label key={val} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="status"
                value={val}
                checked={statusFilter === val}
                onChange={() => setStatusFilter(val)}
              />
              {val[0].toUpperCase() + val.slice(1)}
            </label>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6 relative">
        <div className="flex justify-between items-center mb-4">
          <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
            Doubts
          </button>
          <p className="text-sm text-gray-500">
            Showing {filteredDoubts.length} doubts
          </p>
        </div>

        {/* Doubt Cards */}
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <div
              key={doubt._id}
              onClick={() => handleOpenOverlay(doubt)}
              className="cursor-pointer bg-white rounded-lg p-5 shadow border hover:shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                    You (Author)
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(doubt.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <h3 className="text-md font-medium text-gray-800 mb-1">
                {doubt.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {doubt.description.length > 120
                  ? doubt.description.slice(0, 120) + "..."
                  : doubt.description}
              </p>
              {doubt.screenshot && (
                <img
                  src={doubt.screenshot}
                  alt="Screenshot"
                  className="h-32 object-contain border rounded"
                />
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <span>
                  {doubt.status === "open" ? "⚠️ Open" : "✅ Resolved"}
                </span>
                <span>💬 {doubt.commentCount || 0} Comments</span>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay with blurred background */}
        {selectedDoubt && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedDoubt(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mb-2">{selectedDoubt.title}</h2>
              <p className="text-sm text-gray-700 mb-2">
                {selectedDoubt.description}
              </p>
              {selectedDoubt.screenshot && (
                <img
                  src={selectedDoubt.screenshot}
                  alt="Screenshot"
                  className="h-40 object-contain border rounded mb-4"
                />
              )}
              <div>
                {loadingComments ? (
                  <p className="text-gray-500">Loading comments...</p>
                ) : comments.length ? (
                  comments.map((c) => renderComment(c))
                ) : (
                  <p className="italic text-gray-400">No comments yet.</p>
                )}
              </div>

              {/* Reply Section */}
              <div className="mt-4">
                {replyToCommentId && (
                  <div className="bg-blue-50 p-2 rounded mb-2 text-sm">
                    <span className="text-blue-600">
                      Replying to:{" "}
                      {comments.find(
                        (c) =>
                          c._id === replyToCommentId ||
                          c.replies?.some((r) => r._id === replyToCommentId)
                      )?.author?.name || "comment"}
                    </span>
                    <button
                      onClick={() => setReplyToCommentId(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✖ Cancel
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 border rounded px-3 py-2 text-sm"
                    placeholder={
                      replyToCommentId
                        ? "Write your reply..."
                        : "Write a comment..."
                    }
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {replyToCommentId ? "Reply" : "Comment"}
                  </button>
                  {(selectedDoubt.status === "open" ||
                    selectedDoubt.status === "resolved") && (
                    <button
                      onClick={handleToggleResolve}
                      className={`px-4 py-2 rounded text-sm transition-colors ${
                        selectedDoubt.status === "resolved"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {selectedDoubt.status === "resolved"
                        ? "Reopen Doubt"
                        : "Mark as Resolved"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => navigate("/doubts/create")}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-indigo-700"
        >
          + Ask a Doubt
        </button>
      </main>
    </div>
  );
};

export default StudentDashboard;
