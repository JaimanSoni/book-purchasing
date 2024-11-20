import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import AdminError from "../Pages/Admin/AccessDenied"

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  // return children;
  return isAdmin ? children : <AdminError />;
};

export default ProtectedRoute;
