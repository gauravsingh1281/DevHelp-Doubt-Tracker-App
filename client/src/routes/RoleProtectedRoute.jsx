import { Navigate } from "react-router-dom";
import NotAuthorized from "../pages/NotAuthorized";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user?.role)) {
    return <NotAuthorized />;
  }

  return children;
};

export default RoleProtectedRoute;
