import { NavLink, useNavigate } from "react-router";
import { MdMenu } from "react-icons/md";
import logo from "../assets/images/logo.png";
export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center bg-white4 py-5 px-4 md:px-10 lg:px-10 font-Inter">
      <img
        src={logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="w-[240px] cursor-pointer"
      />
      <nav className="hidden lg:flex justify-center items-center gap-10 text-xl">
        <NavLink
          className={(e) => (e.isActive ? "text-[#F5418D] font-bold" : "")}
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className={(e) => (e.isActive ? "text-[#F5418D] font-bold" : "")}
          to="aboutUs"
        >
          About
        </NavLink>
        <NavLink
          className={(e) => (e.isActive ? "text-[#F5418D] font-bold" : "")}
          to="contactUs"
        >
          Contact Us
        </NavLink>
      </nav>
      <div className="hidden lg:flex items-center justify-center gap-6">
        <button
          onClick={() => navigate("/login")}
          className="py-1 px-3 bg-white border-2 border-black rounded-lg cursor-pointer "
        >
          Login
        </button>
        <button
          onClick={() => navigate("/register")}
          className="py-1 px-3 bg-black border-2 border-black text-white rounded-lg  cursor-pointer"
        >
          Signup
        </button>
      </div>
      <MdMenu className="block lg:hidden text-4xl" />
    </header>
  );
}
