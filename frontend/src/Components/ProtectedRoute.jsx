import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  return isAdmin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
