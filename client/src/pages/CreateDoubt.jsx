import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../../api/apiInstance";

const CreateDoubt = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    screenshot: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiInstance.post("/doubts", form);
      toast.success("✅ Doubt posted successfully!");
      navigate("/"); // redirect if needed
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.msg || "Failed to post doubt"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-6">📝 Create a New Doubt</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full border p-2 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Describe your problem..."
          className="w-full border p-2 mb-4 rounded min-h-[120px]"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="screenshot"
          placeholder="Screenshot URL (optional)"
          className="w-full border p-2 mb-6 rounded"
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Posting..." : "Submit Doubt"}
        </button>
      </form>
    </div>
  );
};

export default CreateDoubt;
