const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center p-6">
      <div className="bg-white shadow-xl p-12 rounded-2xl max-w-md">
        <h1 className="text-4xl font-Cormorant font-bold text-[#F7418D] mb-4">
          🚫 Not Authorized
        </h1>
        <p className="text-gray-700 text-lg font-Cormorant">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;
