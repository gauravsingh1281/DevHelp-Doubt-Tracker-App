import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiInstance from "../../api/apiInstance";

const MentorComments = ({ doubtId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await apiInstance.get(`/comments/${doubtId}`);
      setComments(res.data);
    } catch (err) {
      toast.error("Failed to fetch mentor comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [doubtId]);

  if (loading)
    return <p className="text-gray-400 text-sm">Loading comments...</p>;

  return (
    <ul className="list-disc list-inside space-y-1 text-sm text-gray-800">
      {comments.length > 0 ? (
        comments.map((c) => (
          <li key={c._id}>
            <span className="font-semibold">{c.author.name}</span>: {c.text}
          </li>
        ))
      ) : (
        <p className="italic text-gray-500">No mentor replies yet.</p>
      )}
    </ul>
  );
};

export default MentorComments;
