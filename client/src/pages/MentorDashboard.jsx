import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import apiInstance from "../api/apiInstance";
import MentorComments from "../components/MentorComments";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [commentCounts, setCommentCounts] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchAllDoubts = async () => {
    setRefreshing(true);
    try {
      const res = await apiInstance.get("/doubts");
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
          ...prev, // Keep any real-time updates that might be higher than backend data
        };

        return merged;
      });
    } catch (err) {
      console.error("Error fetching doubts:", err);
      toast.error("Failed to load doubts");
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleResolve = async (doubtId, currentStatus) => {
    const newStatus = currentStatus === "resolved" ? "open" : "resolved";
    try {
      await apiInstance.patch(`/doubts/${doubtId}/toggle-status`);
      const statusText = newStatus === "resolved" ? "resolved" : "reopened";
      toast.success(`Doubt marked as ${statusText}`);

      // Update the doubt in state
      setDoubts((prev) =>
        prev.map((doubt) =>
          doubt._id === doubtId ? { ...doubt, status: newStatus } : doubt
        )
      );

      // Update selected doubt if it's the same
      if (selectedDoubt?._id === doubtId) {
        setSelectedDoubt((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Error toggling doubt status:", err);
      toast.error("Could not update doubt status");
    }
  };

  const handleOpenDetails = (doubt) => {
    setSelectedDoubt(doubt);
  };

  const updateCommentCount = useCallback((doubtId, count) => {
    setCommentCounts((prev) => ({
      ...prev,
      [doubtId]: count,
    }));
  }, []);

  useEffect(() => {
    fetchAllDoubts();
  }, []);

  const filteredDoubts = doubts.filter((d) => {
    if (statusFilter === "all") return true;
    return d.status === statusFilter;
  });

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
              onClick={() => navigate(-1)}
              className="text-2xl bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ←
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center"
            >
              ✖
            </button>
          </div>

          <h1 className="text-xl lg:text-2xl font-semibold mb-6">
            Student Doubts
          </h1>
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
          <h1 className="text-lg font-semibold text-gray-800">
            Mentor Dashboard
          </h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Desktop Header and Content */}
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="hidden lg:block text-2xl font-bold text-gray-800">
              Mentor Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={fetchAllDoubts}
                disabled={refreshing}
                className={`px-3 py-2 rounded-lg transition-colors text-sm cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center ${
                  refreshing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                title="Refresh doubts and comment counts"
              >
                {refreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
              </button>
              <div className="text-sm text-gray-500 text-center sm:text-left w-full sm:w-auto">
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
                  className="bg-white rounded-lg p-4 lg:p-6 shadow border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 mb-2">
                        <h2 className="text-base lg:text-lg font-semibold text-gray-800 break-words">
                          {doubt.title}
                        </h2>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium self-start ${
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
                        <span className="truncate">
                          👤 {doubt.student?.name || "Unknown Student"}
                        </span>
                        <span className="truncate">
                          📧 {doubt.student?.email || "No email"}
                        </span>
                        <span className="whitespace-nowrap">
                          🕒 {new Date(doubt.createdAt).toLocaleDateString()}
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
                        💬 {commentCounts[doubt._id] || doubt.commentCount || 0}{" "}
                        Comments
                      </span>
                      <span>📚 {doubt.subject || "General"}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => handleOpenDetails(doubt)}
                        className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() =>
                          handleToggleResolve(doubt._id, doubt.status)
                        }
                        className={`px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm cursor-pointer ${
                          doubt.status === "resolved"
                            ? "bg-orange-600 hover:bg-orange-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {doubt.status === "resolved"
                          ? "Reopen"
                          : "Mark Resolved"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
                    <span className="text-sm text-gray-600 truncate">
                      by {selectedDoubt.student?.name || "Unknown"}
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
                  onClick={() => setSelectedDoubt(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl cursor-pointer p-1"
                >
                  ✖
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
                    <strong>Student:</strong>{" "}
                    <span className="break-words">
                      {selectedDoubt.student?.name || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    <span className="break-all">
                      {selectedDoubt.student?.email || "No email"}
                    </span>
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(selectedDoubt.createdAt).toLocaleDateString()}
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
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    onClick={() =>
                      handleToggleResolve(
                        selectedDoubt._id,
                        selectedDoubt.status
                      )
                    }
                    className={`px-4 lg:px-6 py-2 rounded-lg transition-colors cursor-pointer text-sm lg:text-base ${
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
                    onClick={() => setSelectedDoubt(null)}
                    className="px-4 lg:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer text-sm lg:text-base"
                  >
                    Close
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

export default MentorDashboard;
