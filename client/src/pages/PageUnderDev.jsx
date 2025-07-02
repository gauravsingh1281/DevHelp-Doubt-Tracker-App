import { useNavigate } from "react-router-dom";
import PageUnderDevIllustration from "../assets/images/page-underDev.svg";

const PageUnderDev = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-xl overflow-hidden flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 w-full h-80 lg:h-full">
          <img
            src={PageUnderDevIllustration}
            alt="Page under development"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:w-1/2 w-full p-6 text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Coming Soon!</h1>
          <p className="text-gray-600 text-lg">
            This page is currently under development. We're working hard to
            bring you amazing features!
          </p>
          <p className="text-gray-500 text-sm">
            Stay tuned for updates and check back soon.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-block bg-indigo-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageUnderDev;
