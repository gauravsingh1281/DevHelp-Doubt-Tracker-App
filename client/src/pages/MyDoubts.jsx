import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiInstance from "../../api/apiInstance";
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
      toast.error("Failed to fetch doubts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📋 My Posted Doubts
      </h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : doubts.length === 0 ? (
        <p className="text-center text-gray-500">No doubts found.</p>
      ) : (
        <div className="space-y-6">
          {doubts.map((doubt) => (
            <div
              key={doubt._id}
              className="bg-white p-4 rounded shadow-md border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{doubt.title}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    doubt.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {doubt.status}
                </span>
              </div>
              <p className="text-gray-700 mt-2">{doubt.description}</p>
              {doubt.screenshot && (
                <img
                  src={doubt.screenshot}
                  alt="screenshot"
                  className="mt-3 max-w-sm rounded border"
                />
              )}

              {/* Comments section */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Mentor Comments:
                </h4>
                <MentorComments doubtId={doubt._id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDoubts;
