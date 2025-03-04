import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import Navigationbar from "../components/Navigationbar";

const LEVEL_EXP_TABLE = {
  1: { min: 0, max: 100, description: "초보자" },
  2: { min: 100, max: 300, description: "학습자" },
  3: { min: 300, max: 600, description: "중급자" },
  4: { min: 600, max: 1000, description: "상급자" },
  5: { min: 1000, max: Infinity, description: "마스터" },
};

const getExpForLevel = (level) => {
  return LEVEL_EXP_TABLE[level] || { min: 0, max: 100, description: "초보자" };
};

const LevelPage = () => {
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
            current_exp: response.data.current_exp || 0,
            required_exp: response.data.required_exp || 100,
          });
        }
      } catch (error) {
        console.error("Failed to fetch level info:", error);
        setError("레벨 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchLevelInfo();
  }, []);

  if (error) {
    return (
      <Box
        sx={{
          background: "#1E2A3A",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FF4444",
        }}
      >
        {error}
      </Box>
    );
  }

  if (!levelInfo) return null;

  const currentLevelExp = getExpForLevel(levelInfo.level);
  const nextLevelExp = getExpForLevel(levelInfo.level + 1);
  const progress =
    levelInfo.level >= 100
      ? 100
      : ((levelInfo.current_exp - currentLevelExp.min) /
          (currentLevelExp.max - currentLevelExp.min)) *
        100;

  return (
    <Box
      sx={{
        background: "#1E2A3A",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: "#FFFFFF",
            fontWeight: "bold",
            textAlign: "center",
            mb: 4,
          }}
        >
          레벨 여정
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 4,
          }}
        >
          {Object.entries(LEVEL_EXP_TABLE).map(([level, info]) => {
            const isCurrentLevel = parseInt(level) === levelInfo.level;
            const isLocked = parseInt(level) > levelInfo.level;
            const isCompleted = parseInt(level) < levelInfo.level;

            return (
              <Box
                key={level}
                sx={{
                  backgroundColor: isCurrentLevel
                    ? "rgba(155, 135, 245, 0.1)"
                    : isLocked
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 229, 255, 0.1)",
                  borderRadius: "12px",
                  p: 2,
                  position: "relative",
                  opacity: isLocked ? 0.5 : 1,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: isLocked ? "none" : "translateX(10px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {info.description}
                  </Typography>
                  <Typography
                    sx={{
                      color: isCurrentLevel
                        ? "#9b87f5"
                        : isLocked
                        ? "#FFFFFF"
                        : "#00E5FF",
                      fontSize: "1.1rem",
                    }}
                  >
                    Lv.{level}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    opacity: 0.7,
                    fontSize: "0.9rem",
                    mt: 1,
                  }}
                >
                  {info.min} ~ {info.max} EXP
                </Typography>
                {isCurrentLevel && (
                  <Box
                    sx={{
                      mt: 2,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      height: 8,
                      borderRadius: 4,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${progress}%`,
                        height: "100%",
                        backgroundColor: "#00E5FF",
                        borderRadius: 4,
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Paper
          sx={{
            p: 3,
            backgroundColor: "rgba(30, 42, 58, 0.8)",
            backdropFilter: "blur(8px)",
            borderRadius: "12px",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "1.1rem",
              mb: 2,
            }}
          >
            현재 레벨: {levelInfo.level}
          </Typography>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "1.1rem",
              mb: 2,
            }}
          >
            현재 경험치: {levelInfo.current_exp}
          </Typography>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: "1.1rem",
            }}
          >
            다음 레벨까지: {currentLevelExp.max - levelInfo.current_exp} EXP
          </Typography>
        </Paper>

        <Button
          variant="contained"
          onClick={() => navigate("/wordset")}
          sx={{
            backgroundColor: "#9b87f5",
            color: "#FFFFFF",
            padding: "12px 24px",
            fontSize: "1.1rem",
            fontWeight: "700",
            borderRadius: "12px",
            textTransform: "none",
            width: "100%",
            boxShadow: "0px 4px 10px rgba(155, 135, 245, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(155, 135, 245, 0.9)",
            },
          }}
        >
          단어 학습하기
        </Button>
      </Container>
      <Navigationbar />
    </Box>
  );
};

export default LevelPage;
