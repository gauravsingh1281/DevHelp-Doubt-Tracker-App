import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiInstance from "../../api/apiInstance";

const MentorDashboard = () => {
  const [doubts, setDoubts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [commentText, setCommentText] = useState({});

  const fetchAllDoubts = async () => {
    try {
      const res = await apiInstance.get("/doubts");
      setDoubts(res.data);
    } catch (err) {
      toast.error("Failed to load doubts");
    }
  };

  useEffect(() => {
    fetchAllDoubts();
  }, []);

  const handleAddComment = async (doubtId) => {
    if (!commentText[doubtId]) return;
    try {
      await apiInstance.post(`/comments/${doubtId}`, {
        text: commentText[doubtId],
        doubt: doubtId,
      });
      toast.success("Comment added");
      setCommentText({ ...commentText, [doubtId]: "" });
      fetchAllDoubts();
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to add comment");
    }
  };

  const handleResolve = async (doubtId) => {
    try {
      await apiInstance.patch(`/doubts/${doubtId}/resolve`);
      toast.success("Doubt marked as resolved");
      fetchAllDoubts();
    } catch (err) {
      toast.error("Could not resolve doubt");
    }
  };

  const filteredDoubts = doubts.filter((d) => {
    if (statusFilter === "all") return true;
    return d.status === statusFilter;
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-6">Filter</h2>
        <div className="mb-6">
          <h3 className="font-medium mb-2">Status</h3>
          {[
            { label: "All", value: "all" },
            { label: "Open", value: "open" },
            { label: "Resolved", value: "resolved" },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center space-x-2 cursor-pointer mb-2"
            >
              <input
                type="radio"
                name="status"
                value={item.value}
                checked={statusFilter === item.value}
                onChange={() => setStatusFilter(item.value)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">All Student Doubts</h1>

        {filteredDoubts.length === 0 ? (
          <p className="text-gray-500">No doubts found.</p>
        ) : (
          <div className="space-y-6">
            {filteredDoubts.map((doubt) => (
              <div
                key={doubt._id}
                className="bg-white p-5 rounded shadow border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{doubt.title}</h2>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium uppercase ${
                      doubt.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {doubt.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2 text-sm">
                  {doubt.description}
                </p>
                <div className="text-xs text-gray-500 flex gap-4 mb-4">
                  <span>🕒 {new Date(doubt.createdAt).toLocaleString()}</span>
                  <span>👤 {doubt.student?.name || "Unknown"}</span>
                  <span>📌 {doubt.subject || "General"}</span>
                </div>

                {/* Comment input */}
                {doubt.status !== "resolved" && (
                  <div className="space-y-2">
                    <textarea
                      className="w-full border rounded p-2 text-sm"
                      placeholder="Write a reply or suggestion..."
                      value={commentText[doubt._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [doubt._id]: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddComment(doubt._id)}
                        className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleResolve(doubt._id)}
                        className="bg-green-600 text-white px-4 py-1 rounded text-sm"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MentorDashboard;
