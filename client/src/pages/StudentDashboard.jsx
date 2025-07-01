// src/pages/StudentDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../../api/apiInstance";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [doubts, setDoubts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDoubts = async () => {
    try {
      const res = await apiInstance.get("/doubts/my");
      setDoubts(res.data);
    } catch (error) {
      console.error("Error fetching doubts:", error);
      toast.error("Failed to load your doubts");
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

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
          {[
            { label: "All", value: "all" },
            { label: "Open", value: "open" },
            { label: "Resolved", value: "resolved" },
          ].map((item) => (
            <label key={item.value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="status"
                value={item.value}
                checked={statusFilter === item.value}
                onChange={() => setStatusFilter(item.value)}
              />
              {item.label}
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
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <div
              key={doubt._id}
              className="bg-white rounded-lg p-5 shadow border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                    You (Author)
                  </span>
                  <span className="text-xs text-gray-400">
                    asked at {new Date(doubt.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <h3 className="text-md font-medium text-gray-800 mb-1">
                {doubt.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3">
                {doubt.description.length > 120
                  ? doubt.description.slice(0, 120) + "..."
                  : doubt.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  {doubt.status === "open" ? "⚠️ Open" : "✅ Resolved"}
                </span>
                <span>💬 {doubt.commentCount || 0} Comments</span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Ask Button */}
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
