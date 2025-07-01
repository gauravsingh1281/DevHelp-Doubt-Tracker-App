import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";
import MentorComments from "../components/MentorComments";

const MyDoubts = () => {
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoubts = async () => {
    setLoading(true);
    try {
      const res = await apiInstance.get("/doubts/my");
      setDoubts(res.data);
    } catch (err) {
      toast.error("Failed to fetch your doubts");
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (id) => {
    try {
      await apiInstance.patch(`/doubts/${id}/resolve`);
      toast.success("✅ Doubt marked as resolved");
      fetchDoubts(); // refresh the list
    } catch (err) {
      toast.error("❌ Failed to update doubt status");
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">📋 My Doubts</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : doubts.length === 0 ? (
        <p className="text-center text-gray-400">
          You haven’t posted any doubts yet.
        </p>
      ) : (
        <div className="space-y-6">
          {doubts.map((doubt) => (
            <div
              key={doubt._id}
              className="bg-white p-5 rounded shadow border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{doubt.title}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    doubt.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {doubt.status}
                </span>
              </div>

              <p className="text-gray-700">{doubt.description}</p>

              {doubt.screenshot && (
                <img
                  src={doubt.screenshot}
                  alt="screenshot"
                  className="mt-3 rounded max-w-xs border"
                />
              )}

              {/* Comments Section */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-gray-600">
                  Mentor Comments:
                </h4>
                <MentorComments doubtId={doubt._id} />
              </div>

              {/* Resolve Button */}
              {doubt.status !== "resolved" && (
                <button
                  onClick={() => markAsResolved(doubt._id)}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  ✅ Mark as Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDoubts;
