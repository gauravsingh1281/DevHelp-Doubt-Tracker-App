import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";
import { AuthContext } from "../context/AuthContext";
import MentorComments from "../components/MentorComments";
import { MdClose } from "react-icons/md";
import { FaCode, FaRegClock, FaRegCommentDots, FaUser } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";

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
    screenshot: null,
    existingScreenshot: "",
  });
  const [editPreviewUrl, setEditPreviewUrl] = useState("");
  const [commentCounts, setCommentCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    setRefreshing(true);
    try {
      const res = await apiInstance.get("/doubts/my");
      setDoubts(res.data);

      // Initialize comment counts from the backend data
      const initialCommentCounts = {};
      res.data.forEach((doubt) => {
        if (doubt.commentCount !== undefined) {
          initialCommentCounts[doubt._id] = doubt.commentCount;
        }
      });

      setCommentCounts((prev) => {
        const merged = {
          ...initialCommentCounts,
          ...prev,
        };
        return merged;
      });
    } catch {
      toast.error("Failed to load doubts");
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenOverlay = (doubt) => {
    setSelectedDoubt(doubt);

    if (doubt._id && commentCounts[doubt._id] === undefined) {
      setCommentCounts((prev) => ({
        ...prev,
        [doubt._id]: doubt.commentCount || 0,
      }));
    }
  };

  const updateCommentCount = useCallback((doubtId, count) => {
    setCommentCounts((prev) => ({
      ...prev,
      [doubtId]: count,
    }));
  }, []);

  const handleCommentsUpdate = useCallback(
    (count) => {
      if (selectedDoubt?._id) {
        updateCommentCount(selectedDoubt._id, count);
      }
    },
    [selectedDoubt?._id, updateCommentCount]
  );

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

      setDoubts((prev) =>
        prev.map((doubt) =>
          doubt._id === selectedDoubt._id
            ? { ...doubt, status: newStatus }
            : doubt
        )
      );

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
      screenshot: null,
      existingScreenshot: doubt.screenshot || "",
    });
    setEditPreviewUrl(doubt.screenshot || "");
  };

  const handleEditFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot") {
      const file = files[0];
      setEditDoubtForm({ ...editDoubtForm, screenshot: file });
      if (file) {
        setEditPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setEditDoubtForm({ ...editDoubtForm, [name]: value });
    }
  };

  const handleRemoveEditScreenshot = () => {
    setEditDoubtForm({
      ...editDoubtForm,
      screenshot: null,
      existingScreenshot: "",
    });
    setEditPreviewUrl("");
  };

  const handleUpdateDoubt = async () => {
    if (!editDoubtForm.title.trim() || !editDoubtForm.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editDoubtForm.title);
      formData.append("description", editDoubtForm.description);

      // If a new screenshot file is selected, append it
      if (editDoubtForm.screenshot) {
        formData.append("screenshot", editDoubtForm.screenshot);
      } else if (editDoubtForm.existingScreenshot) {
        // Keep existing screenshot URL if no new file is selected
        formData.append("existingScreenshot", editDoubtForm.existingScreenshot);
      }

      await apiInstance.patch(`/doubts/${editingDoubt._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Doubt updated successfully");
      setEditingDoubt(null);
      setEditDoubtForm({
        title: "",
        description: "",
        screenshot: null,
        existingScreenshot: "",
      });
      setEditPreviewUrl("");
      fetchDoubts();

      // Update selected doubt if it's currently open
      if (selectedDoubt && selectedDoubt._id === editingDoubt._id) {
        const updatedDoubt = {
          ...selectedDoubt,
          title: editDoubtForm.title,
          description: editDoubtForm.description,
          // Keep existing screenshot unless a new one was uploaded
          screenshot: editDoubtForm.screenshot
            ? editPreviewUrl
            : editDoubtForm.existingScreenshot,
        };
        setSelectedDoubt(updatedDoubt);
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
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center"
            >
              ✖
            </button>
          </div>

          <h1 className="text-xl lg:text-2xl font-semibold mb-6">My Doubts</h1>
          <h2 className="text-base lg:text-lg font-bold mb-4">Status Filter</h2>
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-Cormorant font-semibold text-gray-800">
            Student Dashboard
          </h1>
          <button
            onClick={() => navigate("/dashboard/student/doubts/create")}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 active:scale-[94%] transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Header and Content */}
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="hidden lg:block text-3xl font-Cormorant font-bold text-gray-900">
              Student Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={fetchDoubts}
                disabled={refreshing}
                className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center font-OpenSans ${
                  refreshing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 active:scale-[94%]"
                }`}
                title="Refresh doubts and comment counts"
              >
                {refreshing ? (
                  <span className="flex items-center gap-2">
                    <FiRefreshCcw className="inline-block " />
                    Refreshing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiRefreshCcw className="inline-block" />
                    Refresh
                  </span>
                )}
              </button>
              <div className="text-sm text-gray-500 text-center sm:text-left w-full sm:w-auto font-Cormorant">
                Total: {doubts.length} doubts
              </div>
            </div>
          </div>

          {/* Doubt Cards */}
          {doubts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                You have not asked any doubts yet. Click the button below to ask
                your first doubt!
              </p>
            </div>
          ) : (
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
                    className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200 hover:shadow-md hover:scale-[101%] transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                          <h2 className="text-base lg:text-lg font-Cormorant font-semibold text-gray-800 break-words">
                            {doubt.title.length > 85
                              ? `${doubt.title.slice(0, 85)}...`
                              : doubt.title}
                          </h2>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium self-start font-OpenSans ${
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

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm text-gray-500 mb-3">
                          <span>
                            <FaUser className="inline-block mr-1" /> You
                            (Author)
                          </span>
                          <span className="whitespace-nowrap">
                            <FaRegClock className="inline-block mr-1" />
                            {new Date(doubt.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed text-sm lg:text-base">
                      {doubt.description.length > 150
                        ? `${doubt.description.slice(0, 150)}...`
                        : doubt.description}
                    </p>

                    {doubt.screenshot && (
                      <div className="mb-4">
                        <img
                          src={doubt.screenshot}
                          alt="Doubt Screenshot"
                          className="max-w-full sm:max-w-sm h-32 object-contain border rounded-lg shadow-sm"
                        />
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs lg:text-sm text-gray-500">
                        <span>
                          <FaRegCommentDots className="inline-block mr-1" />
                          {commentCounts[doubt._id] ||
                            doubt.commentCount ||
                            0}{" "}
                          Comments
                        </span>
                        <span>
                          <FaCode className="inline-block mr-1" />
                          {doubt.subject || "General"}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleOpenOverlay(doubt)}
                          className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                        >
                          View Details
                        </button>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await apiInstance.patch(
                                `/doubts/${doubt._id}/toggle-status`
                              );
                              const newStatus =
                                doubt.status === "resolved"
                                  ? "open"
                                  : "resolved";
                              const statusText =
                                newStatus === "resolved"
                                  ? "resolved"
                                  : "reopened";
                              toast.success(`Doubt marked as ${statusText}`);
                              fetchDoubts();
                            } catch {
                              toast.error("Failed to update doubt status");
                            }
                          }}
                          className={`px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                            doubt.status === "resolved"
                              ? "bg-orange-600 hover:bg-orange-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {doubt.status === "resolved"
                            ? "Reopen"
                            : "Mark as Resolved"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Desktop Floating Action Button */}

          <button
            onClick={() => navigate("/dashboard/student/doubts/create")}
            title="Ask a new doubt"
            className="hidden lg:flex fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
          >
            Ask a Doubt
          </button>
        </div>

        {/* Detailed Doubt Modal */}
        {selectedDoubt && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-2 lg:p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 lg:p-6 flex justify-between items-center">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-lg lg:text-xl font-bold text-gray-800 break-words">
                    {selectedDoubt.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mt-2">
                    <span className="text-sm text-gray-600">
                      by You (Author)
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full self-start ${
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
                  className="text-gray-500 hover:text-gray-700  cursor-pointer p-1"
                >
                  <MdClose className="text-4xl font-bold" />
                </button>
              </div>

              <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                {/* Doubt Details */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description:
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 lg:p-4 rounded-lg text-sm lg:text-base">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 text-sm text-gray-600">
                  <div>
                    <strong>Author:</strong> You
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <span className="break-all">
                      {user?.email || "Your email"}
                    </span>
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
                      onCommentsUpdate={handleCommentsUpdate}
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Unable to load comments
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleEditDoubt(selectedDoubt)}
                    className="px-4 lg:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm lg:text-base cursor-pointer"
                  >
                    Edit Doubt
                  </button>
                  <button
                    onClick={handleToggleResolve}
                    className={`px-4 lg:px-6 py-2 rounded-lg transition-colors text-sm lg:text-base cursor-pointer ${
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
                    className="px-4 lg:px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm lg:text-base cursor-pointer"
                  >
                    Delete Doubt
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-4 lg:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm lg:text-base cursor-pointer"
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
          <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-2 lg:p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 lg:p-6 flex justify-between items-center">
                <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                  Edit Doubt
                </h2>
                <button
                  onClick={() => {
                    setEditingDoubt(null);
                    setEditDoubtForm({
                      title: "",
                      description: "",
                      screenshot: null,
                      existingScreenshot: "",
                    });
                    setEditPreviewUrl("");
                  }}
                  className="text-gray-500 hover:text-gray-700  cursor-pointer p-1"
                >
                  <MdClose className="text-4xl font-bold" />
                </button>
              </div>

              <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editDoubtForm.title}
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                    placeholder="Enter a clear, concise title for your doubt"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={editDoubtForm.description}
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm lg:text-base"
                    rows="6"
                    placeholder="Describe your problem in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screenshot (Optional)
                  </label>

                  {/* Current/Preview Image */}
                  {(editPreviewUrl || editDoubtForm.existingScreenshot) && (
                    <div className="mb-3">
                      <div className="relative inline-block">
                        <img
                          src={
                            editPreviewUrl || editDoubtForm.existingScreenshot
                          }
                          alt="Screenshot preview"
                          className="max-w-full sm:max-w-sm h-32 object-contain border rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveEditScreenshot}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          <MdClose className="text-lg" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {editPreviewUrl && editDoubtForm.screenshot
                          ? "New screenshot selected"
                          : "Current screenshot"}
                      </p>
                    </div>
                  )}

                  {/* File Input */}
                  <input
                    type="file"
                    name="screenshot"
                    accept="image/*"
                    onChange={handleEditFormChange}
                    className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select a new image to replace the current screenshot, or
                    leave empty to keep existing
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={handleUpdateDoubt}
                    className="px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer text-sm lg:text-base"
                  >
                    Update Doubt
                  </button>
                  <button
                    onClick={() => {
                      setEditingDoubt(null);
                      setEditDoubtForm({
                        title: "",
                        description: "",
                        screenshot: null,
                        existingScreenshot: "",
                      });
                      setEditPreviewUrl("");
                    }}
                    className="px-4 lg:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
