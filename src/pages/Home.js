import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import CurrentRank from "../components/CurrentRank";
import LevelDisplay from "../components/LevelDisplay";
import Navigationbar from "../components/Navigationbar";
import { useButtonFeedback } from "../hooks/useButtonFeedback";
import api from "../utils/axiosConfig";

const Home = () => {
  const navigate = useNavigate();
  const playFeedback = useButtonFeedback();
  const [userLevel, setUserLevel] = useState(() => {
    const savedLevel = localStorage.getItem("userLevel");
    return savedLevel ? parseInt(savedLevel) : 100;
  });

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const response = await api.get("/auth/account");
        const newLevel = response.data.level;
        setUserLevel(newLevel);
        localStorage.setItem("userLevel", newLevel.toString());
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };

    fetchUserLevel();
  }, []);

  const handleButtonClick = (action) => {
    playFeedback();
    action();
  };

  const isWrongAnswersLocked = userLevel < 3;

  return (
    <Box
      sx={{
        background: "#1E2A3A",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LevelDisplay />
      <Container
        maxWidth="sm"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: "#FFFFFF",
            fontWeight: "bold",
            textAlign: "center",
            mt: { xs: 8, sm: 10 },
            mb: { xs: 4, sm: 5 },
            fontSize: { xs: "2.5rem", sm: "3.5rem" },
            width: "100%",
          }}
        >
          VOCAZOO
        </Typography>

        <Box sx={{ width: "100%", mb: { xs: 4, sm: 5 } }}>
          <CurrentRank />
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: "600px",
            padding: "0 20px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => handleButtonClick(() => navigate("/wordset"))}
            sx={{
              backgroundColor: "#9b87f5",
              color: "#FFFFFF",
              padding: { xs: "16px 32px", sm: "20px 40px" },
              fontSize: { xs: "18px", sm: "22px" },
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
            수능 VOCA
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              !isWrongAnswersLocked &&
              handleButtonClick(() => navigate("/wrong-answers"))
            }
            sx={{
              backgroundColor: "#17202C",
              borderRadius: "12px",
              width: "100%",
              padding: "24px",
              textAlign: "center",
              color: "#FFFFFF",
              border: "none",
              opacity: isWrongAnswersLocked ? 0.7 : 1,
              pointerEvents: isWrongAnswersLocked ? "none" : "auto",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#1a2634",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease-in-out",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {isWrongAnswersLocked ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  gap: 2,
                }}
              >
                <LockIcon sx={{ color: "#FFFFFF", fontSize: "2rem" }} />
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                    textAlign: "center",
                  }}
                >
                  레벨 3 달성 시 오답노트가 공개됩니다
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    flex: 1,
                  }}
                >
                  오답노트
                </Typography>
              </Box>
            )}
          </Button>
        </Box>
      </Container>
      <Navigationbar />
    </Box>
  );
};

export default Home;
