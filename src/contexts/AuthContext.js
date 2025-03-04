import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isDevelopment = process.env.NODE_ENV === "development";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isDevelopment) {
          // 개발 모드에서는 자동으로 인증된 상태로 설정
          setIsAuthenticated(true);
          setIsAdmin(true);
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const response = await api.get("/auth/check");
        setIsAuthenticated(true);
        setIsAdmin(response.data.is_admin || false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isDevelopment]);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token, is_admin } = response.data;
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
      setIsAdmin(is_admin);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
