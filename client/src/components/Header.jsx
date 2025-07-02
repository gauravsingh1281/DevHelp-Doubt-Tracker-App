import { NavLink, useNavigate } from "react-router";
import { MdMenu } from "react-icons/md";
import logo from "../assets/images/logo.png";
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center bg-white py-5 px-4 md:px-10 lg:px-10 font-Cormorant">
      <img
        src={logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="w-[240px] cursor-pointer"
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
      <MdMenu className="block lg:hidden text-4xl" />
    </header>
  );
}
