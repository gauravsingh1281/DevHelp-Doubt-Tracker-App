const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center p-6">
      <div className="bg-white shadow-md p-10 rounded max-w-md">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          🚫 Not Authorized
        </h1>
        <p className="text-gray-700 text-lg">
          You do not have permission to access this page.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;
