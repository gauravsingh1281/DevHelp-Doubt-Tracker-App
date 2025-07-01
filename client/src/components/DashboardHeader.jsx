import React from "react";
import { MdMenu } from "react-icons/md";
import logo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
const DashboardHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="flex justify-between items-center bg-white4 py-5 px-4 md:px-10 lg:px-10 font-Inter">
      <img
        src={logo}
        alt="logo"
        onClick={() => navigate("/")}
        className="w-[240px] cursor-pointer"
      />

      <h1>Profile</h1>
    </header>
  );
};

export default DashboardHeader;
