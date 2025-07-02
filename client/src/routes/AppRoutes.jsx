import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import CreateDoubt from "../pages/CreateDoubt";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
import DashboardLayout from "../layout/DashboardLayout";
import StudentDashboard from "../pages/StudentDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotAuthorized from "../pages/NotAuthorized";
const AppRoutes = () => {
  const DashboardRedirect = () => {
    const { user } = useContext(AuthContext);
    console.log(user);
    if (!user) return <Navigate to="/login" replace />;
    return user.role === "mentor" ? (
      <Navigate to="/dashboard/mentor" replace />
    ) : (
      <Navigate to="/dashboard/student" replace />
    );
  };
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route
          path="student/doubts/create"
          element={
            <RoleProtectedRoute allowedRoles={["student"]}>
              <CreateDoubt />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="student"
          element={
            <RoleProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="mentor"
          element={
            <RoleProtectedRoute allowedRoles={["mentor"]}>
              <MentorDashboard />
            </RoleProtectedRoute>
          }
        />
      </Route>
      <Route path="/not-authorized" element={<NotAuthorized />} />
    </Routes>
  );
};

export default AppRoutes;
