import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import SuspenseLoader from "../components/SuspenseLoader";
import PageNotFound from "../pages/PageNotFound";

// Lazy load all components
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const CreateDoubt = lazy(() => import("../pages/CreateDoubt"));
const RootLayout = lazy(() => import("../layout/RootLayout"));
const Home = lazy(() => import("../pages/Home"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const MentorDashboard = lazy(() => import("../pages/MentorDashboard"));
const NotAuthorized = lazy(() => import("../pages/NotAuthorized"));

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
    <Suspense fallback={<SuspenseLoader />}>
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
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
