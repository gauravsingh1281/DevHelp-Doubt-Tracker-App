import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";

const CreateDoubt = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    screenshot: null, // store File object
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "screenshot") {
      const file = files[0];
      setForm({ ...form, screenshot: file });
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      if (form.screenshot) {
        formData.append("screenshot", form.screenshot);
      }

      await apiInstance.post("/doubts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Doubt posted successfully!");
      navigate("/dashboard/student");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to post doubt");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6">
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
            Create Doubt
          </h1>
          <div className="text-sm text-gray-600">
            <p>
              Fill out the form to post your doubt and get help from mentors.
            </p>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 lg:ml-0">
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
          <h1 className="text-lg font-semibold text-gray-800">Create Doubt</h1>
          <div className="w-6" />
        </div>

        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="hidden lg:block text-2xl font-bold text-gray-800 mb-6">
              Ask a New Doubt
            </h1>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-4 lg:p-6 shadow border border-gray-200 space-y-4 lg:space-y-6"
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
                  className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
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
                  className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm lg:text-base"
                  rows="6"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Screenshot
                </label>
                <input
                  type="file"
                  name="screenshot"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                  onChange={handleChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Screenshot Preview"
                    className="mt-3 h-40 object-contain rounded border"
                  />
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Only image files are allowed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm lg:text-base"
                >
                  {loading ? "Posting..." : "Submit Doubt"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-gray-200 text-gray-700 px-4 lg:px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm lg:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateDoubt;
