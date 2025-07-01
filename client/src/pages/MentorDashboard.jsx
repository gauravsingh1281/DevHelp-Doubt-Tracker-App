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

  const fetchAllDoubts = async () => {
    try {
      const res = await apiInstance.get("/doubts");
      setDoubts(res.data);
    } catch (err) {
      console.error("Error fetching doubts:", err);
      toast.error("Failed to load doubts");
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white p-6 border-r shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl mb-6 bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold mb-6">Student Doubts</h1>
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
          <h1 className="text-2xl font-bold text-gray-800">Mentor Dashboard</h1>
          <div className="text-sm text-gray-500">
            Total: {doubts.length} doubts
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
                      <span>👤 {doubt.student?.name || "Unknown Student"}</span>
                      <span>📧 {doubt.student?.email || "No email"}</span>
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
                    <span>� {commentCounts[doubt._id] || 0} Comments</span>
                    <span>� {doubt.subject || "General"}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenDetails(doubt)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        handleToggleResolve(doubt._id, doubt.status)
                      }
                      className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                        doubt.status === "resolved"
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                    >
                      {doubt.status === "resolved" ? "Reopen" : "Mark Resolved"}
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
                      by {selectedDoubt.student?.name || "Unknown"}
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
                  onClick={() => setSelectedDoubt(null)}
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
                    <strong>Student:</strong>{" "}
                    {selectedDoubt.student?.name || "Unknown"}
                  </div>
                  <div>
                    <strong>Email:</strong>{" "}
                    {selectedDoubt.student?.email || "No email"}
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
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() =>
                      handleToggleResolve(
                        selectedDoubt._id,
                        selectedDoubt.status
                      )
                    }
                    className={`px-6 py-2 rounded-lg transition-colors ${
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
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
