import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import logo from "../assets/images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <header className="flex justify-between items-center bg-white py-5 px-4 md:px-10 lg:px-10 font-Cormorant">
      <img
        src={logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="w-[200px] lg:w-[240px] cursor-pointer"
      />
      <nav className="hidden lg:flex justify-center items-center gap-10 text-xl font-medium">
        <NavLink
          className={(e) =>
            e.isActive
              ? "text-[#F7418D] font-bold"
              : "hover:text-[#F7418D] transition-colors duration-200"
          }
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={(e) =>
            e.isActive
              ? "text-[#F7418D] font-bold"
              : "hover:text-[#F7418D] transition-colors duration-200"
          }
          to="aboutUs"
        >
          About
        </NavLink>
        <NavLink
          className={(e) =>
            e.isActive
              ? "text-[#F7418D] font-bold"
              : "hover:text-[#F7418D] transition-colors duration-200"
          }
          to="contactUs"
        >
          Contact Us
        </NavLink>
      </nav>
      <div className="hidden lg:flex items-center justify-center gap-6">
        <button
          onClick={() => navigate("/login")}
          className="py-2 px-4 bg-transparent text-black border-2 border-black rounded-md cursor-pointer active:scale-[94%] transition-all duration-200 ease-in font-OpenSans hover:bg-black hover:text-white"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="py-2 px-4 bg-black text-white rounded-md cursor-pointer active:scale-[94%] transition-all duration-200 ease-in font-OpenSans hover:bg-gray-800"
        >
          Signup
        </button>
      </div>
      <button
        onClick={toggleMobileMenu}
        className="block lg:hidden text-4xl"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
          <div className="flex justify-between items-center p-5 border-b">
            <img src={logo} alt="logo" className="w-36" />
            <button
              onClick={closeMobileMenu}
              className="text-2xl"
              aria-label="Close mobile menu"
            >
              <MdClose />
            </button>
          </div>

          <nav className="flex flex-col p-4 space-y-3 h-full justify-center items-center">
            <NavLink
              className={(e) =>
                e.isActive
                  ? "text-[#F7418D] font-bold text-2xl font-Cormorant py-3 text-center"
                  : "hover:text-[#F7418D] transition-colors duration-200 text-2xl font-Cormorant py-3 text-center"
              }
              to="/"
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
            <NavLink
              className={(e) =>
                e.isActive
                  ? "text-[#F7418D] font-bold text-2xl font-Cormorant py-3 text-center"
                  : "hover:text-[#F7418D] transition-colors duration-200 text-2xl font-Cormorant py-3 text-center"
              }
              to="aboutUs"
              onClick={closeMobileMenu}
            >
              About
            </NavLink>
            <NavLink
              className={(e) =>
                e.isActive
                  ? "text-[#F7418D] font-bold text-2xl font-Cormorant py-3 text-center"
                  : "hover:text-[#F7418D] transition-colors duration-200 text-2xl font-Cormorant py-3 text-center"
              }
              to="contactUs"
              onClick={closeMobileMenu}
            >
              Contact Us
            </NavLink>

            <div className="flex flex-col gap-6 mt-8">
              <button
                onClick={() => {
                  navigate("/login");
                  closeMobileMenu();
                }}
                className="py-3 px-8 bg-transparent text-black border-2 border-black rounded-md cursor-pointer active:scale-[94%] transition-all duration-200 ease-in font-OpenSans hover:bg-black hover:text-white text-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  closeMobileMenu();
                }}
                className="py-3 px-8 bg-black text-white rounded-md cursor-pointer active:scale-[94%] transition-all duration-200 ease-in font-OpenSans hover:bg-gray-800 text-lg"
              >
                Signup
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
