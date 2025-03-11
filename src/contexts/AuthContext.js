import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/auth/check");
      setIsAuthenticated(true);
      setIsAdmin(response.data.isAdmin || false);
      setUserData(response.data);
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      console.log("AuthContext: Attempting login...");
      const response = await api.post("/auth/login", { username, password });
      console.log("AuthContext: Login response received:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        setIsAdmin(response.data.isAdmin || false);
        setUserData(response.data.user || null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserData(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserData(null);
  };

  const value = {
    isAuthenticated,
    isAdmin,
    isLoading,
    userData,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
