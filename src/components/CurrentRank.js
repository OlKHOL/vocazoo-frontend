import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";
import LockIcon from "@mui/icons-material/Lock";

const CurrentRank = () => {
  const [rankInfo, setRankInfo] = useState(null);
  const [userLevel, setUserLevel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rankResponse, levelResponse] = await Promise.all([
          api.get("/rankings"),
          api.get("/user/level"),
        ]);
        setRankInfo(rankResponse.data.currentUser);
        setUserLevel(levelResponse.data.level);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  if (!rankInfo || !userLevel) return null;

  const isLocked = userLevel < 5;

  return (
    <Paper
      sx={{
        p: { xs: 1.8, sm: 2.7 },
        mb: 2,
        cursor: "pointer",
        backgroundColor: "#17202C",
        borderRadius: "12px",
        width: "90%",
        mx: "auto",
        "&:hover": {
          backgroundColor: "#1a2634",
          transform: "translateY(-2px)",
        },
        transition: "all 0.2s ease-in-out",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        opacity: isLocked ? 0.7 : 1,
      }}
      onClick={() => navigate("/rankings")}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 1.5, sm: 3 },
        }}
      >
        {isLocked ? (
          <>
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
                레벨 5 달성 시 랭킹이 공개됩니다
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                backgroundColor: "rgba(155, 135, 245, 0.1)",
                padding: { xs: "12px 18px", sm: "12px 18px" },
                borderRadius: "8px",
                minWidth: "60px",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#9b87f5",
                  fontWeight: "bold",
                  fontSize: { xs: "1.35rem", sm: "1.65rem" },
                }}
              >
                {rankInfo.rank}위
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                flex: 1,
              }}
            >
              {rankInfo.username}
            </Typography>

            <Typography
              sx={{
                color: "#3797E5",
                fontWeight: "bold",
                fontSize: { xs: "1.5rem", sm: "1.8rem" },
                marginLeft: "auto",
              }}
            >
              {rankInfo.score.toFixed(0)}점
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default CurrentRank;
