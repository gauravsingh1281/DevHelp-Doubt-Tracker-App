import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">DevHelp</h1>
              <span className="ml-2 text-gray-600">Doubt Tracker</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Help with Your
            <span className="text-blue-600"> Coding Doubts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with experienced mentors, post your doubts, and get detailed
            solutions. Join our community of learners and mentors today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🎓 Join as Student
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              👨‍🏫 Become a Mentor
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-semibold mb-2">Ask Questions</h3>
            <p className="text-gray-600">
              Post your coding doubts with screenshots and detailed descriptions
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Get Answers</h3>
            <p className="text-gray-600">
              Experienced mentors will help you solve your problems step by step
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Learn & Grow</h3>
            <p className="text-gray-600">
              Track your progress and become a better developer with
              personalized guidance
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center bg-blue-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Join thousands of students and mentors in our growing community
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started Today
          </button>
        </div>
      </main>
    </div>
  );
}
