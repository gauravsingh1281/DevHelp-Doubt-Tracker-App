import { Navigate } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";
import { AuthContext } from "../context/AuthContext";
import MiniLoader from "../components/MiniLoader";

const NotAuthorized = lazy(() => import("../pages/NotAuthorized"));

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Suspense fallback={<MiniLoader text="Loading..." />}>
        <NotAuthorized />
      </Suspense>
    );
  }

  return children;
};

export default RoleProtectedRoute;
