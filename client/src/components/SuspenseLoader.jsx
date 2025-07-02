const SuspenseLoader = ({
  text = "Loading DevHelp",
  subtitle = "Getting things ready for you...",
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        {/* Animated logo/spinner */}
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto">
            <div className="w-20 h-20 border-4 border-[#F7418D] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 w-20 h-20 mx-auto">
            <div
              className="w-14 h-14 mt-3 ml-3 border-2 border-gray-300 border-b-transparent rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          {/* Inner pulse */}
          <div className="absolute inset-0 w-20 h-20 mx-auto flex items-center justify-center">
            <div className="w-6 h-6 bg-[#F7418D] rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <h2 className="text-2xl lg:text-3xl font-Cormorant font-bold text-gray-800 mb-3">
          {text}
        </h2>
        <p className="text-gray-600 font-Cormorant text-lg mb-8 animate-pulse">
          {subtitle}
        </p>

        {/* Progress dots */}
        <div className="flex justify-center space-x-3">
          <div className="w-3 h-3 bg-[#F7418D] rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-[#F7418D] rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-[#F7418D] rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>

        {/* Loading bar */}
        <div className="mt-8 w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-[#F7418D] h-1 rounded-full animate-pulse"
            style={{
              width: "60%",
              animation: "loading-bar 2s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            width: 0%;
          }
          50% {
            width: 60%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default SuspenseLoader;
