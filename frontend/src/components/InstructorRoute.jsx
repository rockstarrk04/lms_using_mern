import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function InstructorRoute({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "instructor" && user?.role !== "admin") {
    toast.error("Access denied. Instructor privileges required.");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default InstructorRoute;