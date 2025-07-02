import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiInstance from "../api/apiInstance";

const CreateDoubt = () => {
  const navigate = useNavigate();

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
      <main className="flex-1 min-w-0 lg:ml-0">
        <div className="px-4 lg:px-8 py-4 lg:py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-center text-2xl lg:text-left lg:text-3xl font-Cormorant font-bold text-gray-900 mb-6">
              Ask a New Doubt
            </h1>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-4 lg:p-8 shadow-sm border border-gray-200 space-y-4 lg:space-y-6"
            >
              <div>
                <label className="block text-sm font-Cormorant font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  placeholder="Enter a clear, concise title for your doubt"
                  className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F7418D] focus:border-transparent text-sm lg:text-base font-OpenSans transition-all duration-200"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-Cormorant font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Describe your problem in detail. Include what you've tried and what error you're getting..."
                  className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F7418D] focus:border-transparent resize-none text-sm lg:text-base font-OpenSans transition-all duration-200"
                  rows="6"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-Cormorant font-medium text-gray-700 mb-2">
                  Upload Screenshot
                </label>
                <input
                  type="file"
                  name="screenshot"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg px-3 lg:px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#F7418D] focus:border-transparent text-sm lg:text-base font-OpenSans transition-all duration-200"
                  onChange={handleChange}
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Screenshot Preview"
                    className="mt-3 h-40 object-contain rounded-lg border shadow-sm"
                  />
                )}
                <p className="text-xs text-gray-500 mt-2 font-Cormorant">
                  Only image files are allowed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-4 lg:px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[94%] transition-all duration-200 ease-in font-OpenSans font-medium text-sm lg:text-base"
                >
                  {loading ? "Posting..." : "Submit Doubt"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/student")}
                  className="bg-transparent text-black border-2 border-black px-4 lg:px-6 py-2 rounded-lg hover:bg-black hover:text-white active:scale-[94%] transition-all duration-200 ease-in font-OpenSans text-sm lg:text-base"
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
