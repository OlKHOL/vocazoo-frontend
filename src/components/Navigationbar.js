import React, { useState, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SchoolIcon from "@mui/icons-material/School";
import { useButtonFeedback } from "../hooks/useButtonFeedback";
import api from "../utils/axiosConfig";

const Navigationbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const playFeedback = useButtonFeedback();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 관리자 권한 확인
    const checkAdmin = async () => {
      try {
        const response = await api.get("/auth/check_admin");
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const response = await api.get("/auth/check_admin");
            setIsAdmin(response.data.is_admin);
          }
        } catch (error) {
          console.error("관리자 권한 확인 오류:", error);
        }
      }
    };

    checkAdmin();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    playFeedback();
    navigate(path);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        backgroundColor: "#17202C",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        zIndex: 1000,
      }}
    >
      <IconButton
        onClick={() => handleNavigation("/")}
        sx={{
          color: isActive("/") ? "#9b87f5" : "#FFFFFF",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#9b87f5",
            transform: "translateY(-2px)",
          },
        }}
      >
        <HomeIcon sx={{ fontSize: "28px" }} />
      </IconButton>

      <IconButton
        onClick={() => handleNavigation("/level")}
        sx={{
          color: isActive("/level") ? "#9b87f5" : "#FFFFFF",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#9b87f5",
            transform: "translateY(-2px)",
          },
        }}
      >
        <SchoolIcon sx={{ fontSize: "28px" }} />
      </IconButton>

      <IconButton
        onClick={() => handleNavigation("/rankings")}
        sx={{
          color: isActive("/rankings") ? "#9b87f5" : "#FFFFFF",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#9b87f5",
            transform: "translateY(-2px)",
          },
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: "28px" }} />
      </IconButton>

      <IconButton
        onClick={() => handleNavigation("/account")}
        sx={{
          color: isActive("/account") ? "#9b87f5" : "#FFFFFF",
          transition: "all 0.2s ease",
          "&:hover": {
            color: "#9b87f5",
            transform: "translateY(-2px)",
          },
        }}
      >
        <AccountCircleIcon sx={{ fontSize: "28px" }} />
      </IconButton>

      {isAdmin && (
        <IconButton
          onClick={() => handleNavigation("/admin")}
          sx={{
            color: isActive("/admin") ? "#9b87f5" : "#FFFFFF",
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#9b87f5",
              transform: "translateY(-2px)",
            },
          }}
        >
          <SettingsIcon sx={{ fontSize: "28px" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default Navigationbar;
