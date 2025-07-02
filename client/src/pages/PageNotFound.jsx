import { Link } from "react-router-dom";
import pageNotFoundIllustration from "../assets/images/error-img.jpg";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-xl overflow-hidden flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 w-full h-80 lg:h-full">
          <img
            src={pageNotFoundIllustration}
            alt="Page Not Found"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:w-1/2 w-full p-6 text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">Oops!</h1>
          <p className="text-gray-600 text-lg">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
