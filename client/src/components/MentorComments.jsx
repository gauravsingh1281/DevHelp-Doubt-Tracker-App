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
      toast.error("Failed to fetch comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [doubtId]);

  if (loading) return <p className="text-gray-400">Loading comments...</p>;

  return (
    <ul className="text-sm text-gray-800 list-disc list-inside space-y-1">
      {comments.length > 0 ? (
        comments.map((c) => (
          <li key={c._id}>
            <span className="font-semibold">{c.author.name}</span>: {c.text}
          </li>
        ))
      ) : (
        <p className="text-gray-500 italic">No comments yet.</p>
      )}
    </ul>
  );
};

export default MentorComments;
