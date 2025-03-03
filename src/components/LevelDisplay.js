import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const LevelDisplay = () => {
  const [levelInfo, setLevelInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevelInfo = async () => {
      try {
        const response = await api.get("/user/level");
        setLevelInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch level info:", error);
      }
    };

    fetchLevelInfo();
  }, []);

  if (!levelInfo) return null;

  const progress =
    levelInfo.level >= 100
      ? 100
      : (levelInfo.current_exp / levelInfo.required_exp) * 100;

  return (
    <Box
      onClick={() => navigate("/level")}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        backgroundColor: "rgba(30, 42, 58, 0.8)",
        backdropFilter: "blur(8px)",
        padding: "12px 16px",
        borderRadius: "12px",
        minWidth: "180px",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(30, 42, 58, 0.95)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Typography
        sx={{
          color: "#FFFFFF",
          fontSize: "1.1rem",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {levelInfo.level >= 100
          ? `Lv.${levelInfo.level}`
          : `Lv.${levelInfo.level} (${Math.round(progress)}%)`}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#00E5FF",
            borderRadius: 4,
          },
        }}
      />
    </Box>
  );
};

export default LevelDisplay;
