import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      try {
        const response = await api.get("/check_auth");
        if (response.status === 200) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsValid(false);
        localStorage.removeItem("token");
      } finally {
        setIsValidating(false);
      }
    };

    checkAuth();
  }, [token]);

  // authError 이벤트 처리
  useEffect(() => {
    const handleAuthError = () => {
      setIsValid(false);
      setIsValidating(false);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    };

    window.addEventListener("authError", handleAuthError);
    return () => window.removeEventListener("authError", handleAuthError);
  }, [navigate]);

  if (isValidating) {
    return null; // 또는 로딩 스피너
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
