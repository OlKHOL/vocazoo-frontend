import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const LEVEL_EXP_TABLE = {
  "1-10": 30,
  "11-20": 60,
  "21-30": 90,
  "31-40": 150,
  "41-50": 250,
  "51-60": 400,
  "61-70": 600,
  "71-80": 900,
  "81-90": 1300,
  "91-100": 1800,
};

const getExpForLevel = (level) => {
  for (const [range, exp] of Object.entries(LEVEL_EXP_TABLE)) {
    const [start, end] = range.split("-").map(Number);
    if (level >= start && level <= end) {
      return exp;
    }
  }
  return 1800;
};

const LevelPage = () => {
  const [levelInfo, setLevelInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLevelInfo = async () => {
      try {
        const response = await api.get("/user/level");
        setLevelInfo(response.data);

        // Scroll to current level after data is loaded
        setTimeout(() => {
          const currentLevelElement = document.querySelector(
            `[data-level="${response.data.level}"]`
          );
          if (currentLevelElement) {
            currentLevelElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 100);
      } catch (error) {
        console.error("Failed to fetch level info:", error);
      }
    };

    fetchLevelInfo();
  }, []);

  const renderLevelNodes = () => {
    if (!levelInfo) return null;

    const currentLevel = levelInfo.level;
    const nodes = [];
    const maxLevel = 100;

    for (let level = maxLevel; level >= 1; level--) {
      const expRequired = getExpForLevel(level);
      const isLocked = level > currentLevel + 1;
      const isMilestone = level % 10 === 0;

      nodes.push(
        <Box
          key={level}
          data-level={level}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            position: "relative",
            mb: { xs: 2, sm: 3 },
            opacity: isLocked ? 0.5 : 1,
            transition: "all 0.3s ease",
            "&:after": {
              content: '""',
              position: "absolute",
              width: "2px",
              height: { xs: "40px", sm: "60px" },
              backgroundColor: isLocked ? "rgba(42, 55, 68, 0.5)" : "#00E5FF",
              bottom: { xs: "-40px", sm: "-60px" },
              opacity: 0.6,
              display: level === 1 ? "none" : "block",
            },
          }}
        >
          <Box
            sx={{
              width: { xs: "100px", sm: "120px" },
              height: { xs: "100px", sm: "120px" },
              borderRadius: isMilestone ? "20px" : "50%",
              background: isMilestone
                ? "linear-gradient(135deg, #2A3744 0%, #1E2A3A 100%)"
                : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transform: `perspective(1000px) rotateX(20deg)`,
              transformStyle: "preserve-3d",
              boxShadow:
                level === currentLevel
                  ? "0 10px 20px rgba(0,229,255,0.3)"
                  : "0 5px 15px rgba(0,0,0,0.3)",
              border: isMilestone
                ? "4px solid #00E5FF"
                : "2px solid rgba(255,255,255,0.1)",
              "&:before": isMilestone
                ? {
                    content: '""',
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40px",
                    height: "20px",
                    background: "#00E5FF",
                    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  }
                : {},
              "&:hover": {
                transform: `perspective(1000px) rotateX(25deg) translateY(-5px)`,
              },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: "bold",
                color: isMilestone ? "#FFFFFF" : "#1E2A3A",
                textShadow: isMilestone
                  ? "0 0 10px rgba(0,229,255,0.5)"
                  : "none",
              }}
            >
              {level}
            </Typography>
            {!isLocked && (
              <Typography
                sx={{
                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                  color: isMilestone ? "#FFFFFF" : "#1E2A3A",
                  opacity: 0.8,
                }}
              >
                {expRequired} EXP
              </Typography>
            )}
          </Box>
        </Box>
      );
    }

    return nodes;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1E2A3A",
        padding: { xs: 2, sm: 3 },
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <Button
        onClick={() => navigate("/")}
        sx={{
          position: "fixed",
          top: { xs: "15px", sm: "20px" },
          left: { xs: "15px", sm: "20px" },
          color: "#FFFFFF",
          fontSize: { xs: "0.9rem", sm: "1rem" },
          textTransform: "none",
          zIndex: 1100,
          backgroundColor: "rgba(30, 42, 58, 0.8)",
          backdropFilter: "blur(8px)",
          padding: "8px 16px",
          borderRadius: "8px",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        }}
      >
        ← Back to Home
      </Button>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: "bold",
          fontSize: { xs: "2rem", sm: "2.5rem" },
          textAlign: "center",
          mt: { xs: 6, sm: 8 },
          mb: { xs: 4, sm: 6 },
        }}
      >
        Level Journey
      </Typography>

      <Box
        sx={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 10,
        }}
      >
        {renderLevelNodes()}
      </Box>
    </Box>
  );
};

export default LevelPage;
