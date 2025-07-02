import React from "react";

const MiniLoader = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-8 h-8 mx-auto mb-3">
          <div className="w-8 h-8 border-2 border-[#F7418D] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-sm text-gray-600 font-Cormorant">{text}</p>
      </div>
    </div>
  );
};

export default MiniLoader;
