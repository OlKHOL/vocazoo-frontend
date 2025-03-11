import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const LevelDisplay = () => {
  const [levelInfo, setLevelInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevelInfo = async () => {
      try {
        const response = await api.get("/auth/account");
        if (response.data) {
          setLevelInfo({
            level: response.data.level || 1,
            current_exp: response.data.exp || 0,
            required_exp: 100  // 기본값 설정
          });
        }
      } catch (error) {
        console.error("Failed to fetch level info:", error);
        setError("레벨 정보를 불러오는데 실패했습니다.");
        // 에러 발생 시 기본값 설정
        setLevelInfo({
          level: 1,
          current_exp: 0,
          required_exp: 100
        });
      }
    };

    fetchLevelInfo();
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          backgroundColor: "rgba(30, 42, 58, 0.8)",
          backdropFilter: "blur(8px)",
          padding: "12px 16px",
          borderRadius: "12px",
          minWidth: "180px",
        }}
      >
        <Typography
          sx={{
            color: "#FF4444",
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (!levelInfo) return null;

  const progress =
    levelInfo.level >= 100
      ? 100
      : (levelInfo.current_exp / levelInfo.required_exp) * 100;

  return (
    <Box
      onClick={() => navigate("/level")}
      sx={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 1000,
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
