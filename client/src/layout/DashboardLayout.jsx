import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <DashboardHeader />
      <Outlet />
    </>
  );
};

export default DashboardLayout;
