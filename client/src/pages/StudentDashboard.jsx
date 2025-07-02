// imports
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";
import { AuthContext } from "../context/AuthContext";
import MentorComments from "../components/MentorComments";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [doubts, setDoubts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [editingDoubt, setEditingDoubt] = useState(null);
  const [editDoubtForm, setEditDoubtForm] = useState({
    title: "",
    description: "",
    screenshot: "",
  });
  const [commentCounts, setCommentCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    console.log("Fetching doubts and refreshing comment counts...");
    setRefreshing(true);
    try {
      const res = await apiInstance.get("/doubts/my");
      setDoubts(res.data);
      console.log("Doubts fetched:", res.data.length);

      // Initialize comment counts from the backend data
      const initialCommentCounts = {};
      res.data.forEach((doubt) => {
        if (doubt.commentCount !== undefined) {
          initialCommentCounts[doubt._id] = doubt.commentCount;
          console.log(
            `Backend comment count for doubt ${doubt._id}:`,
            doubt.commentCount
          );
        }
      });

      // Merge with existing comment counts to preserve real-time updates
      setCommentCounts((prev) => {
        const merged = {
          ...initialCommentCounts,
          ...prev, // Keep any real-time updates that might be higher than backend data
        };
        console.log("Merged comment counts:", merged);
        return merged;
      });
      toast.success("Doubts and comment counts refreshed!");
    } catch {
      toast.error("Failed to load doubts");
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenOverlay = (doubt) => {
    setSelectedDoubt(doubt);
    // Ensure comment count is initialized for this doubt when opened
    if (doubt._id && commentCounts[doubt._id] === undefined) {
      setCommentCounts((prev) => ({
        ...prev,
        [doubt._id]: doubt.commentCount || 0,
      }));
    }
  };

  const updateCommentCount = (doubtId, count) => {
    console.log("Updating comment count for doubt:", doubtId, "to:", count);
    setCommentCounts((prev) => ({
      ...prev,
      [doubtId]: count,
    }));
  };

  const handleCloseModal = () => {
    setSelectedDoubt(null);
    // Optionally refresh doubts to sync any external changes
    // fetchDoubts();
  };

  const handleToggleResolve = async () => {
    if (!selectedDoubt) return;

    try {
      await apiInstance.patch(`/doubts/${selectedDoubt._id}/toggle-status`);
      const newStatus =
        selectedDoubt.status === "resolved" ? "open" : "resolved";
      const statusText = newStatus === "resolved" ? "resolved" : "reopened";
      toast.success(`Doubt marked as ${statusText}`);

      // Update the doubt in state
      setDoubts((prev) =>
        prev.map((doubt) =>
          doubt._id === selectedDoubt._id
            ? { ...doubt, status: newStatus }
            : doubt
        )
      );

      // Update selected doubt
      setSelectedDoubt((prev) => ({ ...prev, status: newStatus }));

      // Refresh doubts to get updated comment counts
      fetchDoubts();
    } catch {
      toast.error("Failed to update doubt status");
    }
  };

  const handleEditDoubt = (doubt) => {
    setEditingDoubt(doubt);
    setEditDoubtForm({
      title: doubt.title,
      description: doubt.description,
      screenshot: doubt.screenshot || "",
    });
  };

  const handleUpdateDoubt = async () => {
    if (!editDoubtForm.title.trim() || !editDoubtForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      await apiInstance.patch(`/doubts/${editingDoubt._id}`, editDoubtForm);
      toast.success("Doubt updated successfully");
      setEditingDoubt(null);
      setEditDoubtForm({ title: "", description: "", screenshot: "" });
      fetchDoubts();
      // Update selected doubt if it's currently open
      if (selectedDoubt && selectedDoubt._id === editingDoubt._id) {
        setSelectedDoubt({ ...selectedDoubt, ...editDoubtForm });
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update doubt");
    }
  };

  const handleDeleteDoubt = async (doubtId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this doubt? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await apiInstance.delete(`/doubts/${doubtId}`);
      toast.success("Doubt deleted successfully");
      fetchDoubts();
      // Close modal if the deleted doubt was currently selected
      if (selectedDoubt && selectedDoubt._id === doubtId) {
        setSelectedDoubt(null);
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete doubt");
    }
  };

  const filteredDoubts = doubts.filter((d) =>
    statusFilter === "all" ? true : d.status === statusFilter
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white p-6 border-r shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl mb-6 bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold mb-6">My Doubts</h1>
        <h2 className="text-lg font-bold mb-4">Status Filter</h2>
        <div className="space-y-2 mb-6">
          {[
            { label: "All", value: "all" },
            { label: "Open", value: "open" },
            { label: "Resolved", value: "resolved" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="status"
                value={item.value}
                checked={statusFilter === item.value}
                onChange={() => setStatusFilter(item.value)}
                className="accent-blue-500"
              />
              {item.label}
            </label>
          ))}
        </div>

        <div className="text-sm text-gray-600">
          <p>Showing {filteredDoubts.length} doubts</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchDoubts}
              disabled={refreshing}
              className={`px-3 py-2 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 ${
                refreshing
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              title="Refresh doubts and comment counts"
            >
              {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
            <div className="text-sm text-gray-500">
              Total: {doubts.length} doubts
            </div>
          </div>
        </div>

        {/* Doubt Cards */}
        <div className="space-y-4">
          {filteredDoubts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No doubts found for the selected filter.
              </p>
            </div>
          ) : (
            filteredDoubts.map((doubt) => (
              <div
                key={doubt._id}
                className="bg-white rounded-lg p-6 shadow border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {doubt.title}
                      </h2>
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          doubt.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {doubt.status === "resolved"
                          ? "✅ Resolved"
                          : "⚠️ Open"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>👤 You (Author)</span>
                      <span>
                        🕒 {new Date(doubt.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {doubt.description.length > 200
                    ? `${doubt.description.slice(0, 200)}...`
                    : doubt.description}
                </p>

                {doubt.screenshot && (
                  <div className="mb-4">
                    <img
                      src={doubt.screenshot}
                      alt="Doubt Screenshot"
                      className="max-w-sm h-32 object-contain border rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      💬 {commentCounts[doubt._id] || doubt.commentCount || 0}{" "}
                      Comments
                    </span>
                    <span>📚 {doubt.subject || "General"}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleOpenOverlay(doubt)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDoubt(doubt);
                      }}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await apiInstance.patch(
                            `/doubts/${doubt._id}/toggle-status`
                          );
                          const newStatus =
                            doubt.status === "resolved" ? "open" : "resolved";
                          const statusText =
                            newStatus === "resolved" ? "resolved" : "reopened";
                          toast.success(`Doubt marked as ${statusText}`);
                          fetchDoubts();
                        } catch {
                          toast.error("Failed to update doubt status");
                        }
                      }}
                      className={`px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm cursor-pointer ${
                        doubt.status === "resolved"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {doubt.status === "resolved" ? "Reopen" : "Resolve"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDoubt(doubt._id);
                      }}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detailed Doubt Modal */}
        {selectedDoubt && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedDoubt.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm text-gray-600">
                      by You (Author)
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedDoubt.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {selectedDoubt.status === "resolved"
                        ? "✅ Resolved"
                        : "⚠️ Open"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✖
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Doubt Details */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description:
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {selectedDoubt.description}
                  </p>
                </div>

                {selectedDoubt.screenshot && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Screenshot:
                    </h3>
                    <img
                      src={selectedDoubt.screenshot}
                      alt="Doubt Screenshot"
                      className="max-w-full h-auto border rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Author:</strong> You
                  </div>
                  <div>
                    <strong>Email:</strong> {user?.email || "Your email"}
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(selectedDoubt.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Subject:</strong>{" "}
                    {selectedDoubt.subject || "General"}
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Comments & Discussion:
                  </h3>
                  {selectedDoubt._id ? (
                    <MentorComments
                      doubtId={selectedDoubt._id}
                      onCommentsUpdate={(count) =>
                        updateCommentCount(selectedDoubt._id, count)
                      }
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Unable to load comments
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleEditDoubt(selectedDoubt)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm cursor-pointer"
                  >
                    ✏️ Edit Doubt
                  </button>
                  <button
                    onClick={handleToggleResolve}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                      selectedDoubt.status === "resolved"
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {selectedDoubt.status === "resolved"
                      ? "Reopen Doubt"
                      : "Mark as Resolved"}
                  </button>
                  <button
                    onClick={() => handleDeleteDoubt(selectedDoubt._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm cursor-pointer"
                  >
                    🗑️ Delete Doubt
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Doubt Modal */}
        {editingDoubt && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Edit Doubt</h2>
                <button
                  onClick={() => {
                    setEditingDoubt(null);
                    setEditDoubtForm({
                      title: "",
                      description: "",
                      screenshot: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer"
                >
                  ✖
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editDoubtForm.title}
                    onChange={(e) =>
                      setEditDoubtForm({
                        ...editDoubtForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a clear, concise title for your doubt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={editDoubtForm.description}
                    onChange={(e) =>
                      setEditDoubtForm({
                        ...editDoubtForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="6"
                    placeholder="Describe your problem in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshot URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={editDoubtForm.screenshot}
                    onChange={(e) =>
                      setEditDoubtForm({
                        ...editDoubtForm,
                        screenshot: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/screenshot.png"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={handleUpdateDoubt}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                  >
                    💾 Update Doubt
                  </button>
                  <button
                    onClick={() => {
                      setEditingDoubt(null);
                      setEditDoubtForm({
                        title: "",
                        description: "",
                        screenshot: "",
                      });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => navigate("/doubts/create")}
          className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
        >
          + Ask a Doubt
        </button>
      </main>
    </div>
  );
};

export default StudentDashboard;
