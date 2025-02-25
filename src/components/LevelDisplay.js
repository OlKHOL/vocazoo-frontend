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
        position: "absolute",
        top: { xs: "15px", sm: "20px" },
        left: { xs: "15px", sm: "20px" },
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        zIndex: 1000,
        minWidth: "150px",
      }}
    >
      <Typography
        sx={{
          color: "#FFFFFF",
          fontSize: { xs: "0.9rem", sm: "1rem" },
          opacity: 0.9,
          "&:hover": {
            color: "#00E5FF",
          },
          transition: "color 0.2s ease",
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
