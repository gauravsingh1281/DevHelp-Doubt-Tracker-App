import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import CreateDoubt from "../pages/CreateDoubt";
import MyDoubts from "../pages/MyDoubts";
import RootLayout from "../layout/RootLayout";
import Home from "../pages/Home";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
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
        <Route
          path="/doubts/my"
          element={
            <ProtectedRoute>
              <MyDoubts />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
