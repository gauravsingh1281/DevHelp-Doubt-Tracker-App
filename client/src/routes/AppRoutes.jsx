import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import CreateDoubt from "../pages/CreateDoubt";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/doubts/create"
        element={
          <ProtectedRoute>
            <CreateDoubt />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
