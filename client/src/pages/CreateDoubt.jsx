import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";

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
      toast.success("Doubt posted successfully!");
      navigate("/dashboard/student"); // redirect if needed
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to post doubt");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-semibold mb-6">Create Doubt</h1>
        <div className="text-sm text-gray-600">
          <p>Fill out the form to post your doubt and get help from mentors.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Ask a New Doubt
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 shadow border border-gray-200 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                placeholder="Enter a clear, concise title for your doubt"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                placeholder="Describe your problem in detail. Include what you've tried and what error you're getting..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="6"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Screenshot URL (Optional)
              </label>
              <input
                type="url"
                name="screenshot"
                value={form.screenshot}
                placeholder="https://example.com/screenshot.png"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload your screenshot to an image hosting service and paste the
                URL here
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Posting..." : "Submit Doubt"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateDoubt;
