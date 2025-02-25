import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // 토큰 유효성 검사
        await api.get("/check_auth");
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
