import { useState, useContext, useRef, useEffect } from "react";
import logo from "../assets/images/logo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaKey, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout(); // This already dismisses toasts in AuthContext
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <>
      <header className="flex justify-between items-center bg-white py-5 px-4 md:px-10 lg:px-10 font-Cormorant shadow-sm border-b border-gray-100">
        <img
          src={logo}
          alt="logo"
          onClick={() => navigate("/dashboard")}
          className="w-[240px] cursor-pointer"
        />

        <div className="relative" ref={dropdownRef}>
          <IoSettingsOutline
            className="text-3xl cursor-pointer hover:text-[#F7418D] transition-colors duration-200"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "user@example.com"}
                </p>
              </div>

              {/* Menu Options */}
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 cursor-pointer">
                  <FaUser className="text-blue-500" />
                  Profile
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full  ${
                      user?.role === "mentor"
                        ? "bg-green-100 text-green-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {user?.role === "mentor" ? "🎓 Mentor" : "👤 Student"}
                  </span>
                </button>

                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 cursor-pointer">
                  <FaKey className="text-orange-500" />
                  Change Password
                </button>

                <hr className="my-1 border-gray-100" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 cursor-pointer"
                >
                  <FaSignOutAlt className="text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
