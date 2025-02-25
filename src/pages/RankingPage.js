import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Navigationbar from "../components/Navigationbar";
import api from "../utils/axiosConfig";

const RankingCard = ({ rank, username, score }) => {
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return "#FFC947"; // 금메달 색상 (더 부드러운 골드)
      case 2:
        return "#E5E5E5"; // 은메달 색상 (밝은 실버)
      case 3:
        return "#E67E22"; // 동메달 색상 (세련된 브론즈)
      default:
        return "#FFFFFF";
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: "#17202C",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        mb: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#1a2634",
          transform: "translateY(-2px)",
        },
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 2, sm: 3 },
          padding: { xs: "16px", sm: "20px" },
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(155, 135, 245, 0.1)",
            padding: { xs: "10px 16px", sm: "12px 20px" },
            borderRadius: "8px",
            minWidth: { xs: "50px", sm: "60px" },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: getMedalColor(rank),
              fontSize: { xs: "20px", sm: "24px" },
              fontWeight: "bold",
            }}
          >
            {rank}위
          </Typography>
        </Box>

        <Avatar
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            backgroundColor: "#9b87f5",
          }}
        >
          {username.charAt(0)}
        </Avatar>

        <Typography
          sx={{
            color: getMedalColor(rank),
            fontSize: { xs: "18px", sm: "22px" },
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {username}
        </Typography>

        <Typography
          sx={{
            color: getMedalColor(rank),
            fontSize: { xs: "20px", sm: "24px" },
            fontWeight: "bold",
            marginLeft: "auto",
          }}
        >
          {score.toFixed(0)}점
        </Typography>
      </CardContent>
    </Card>
  );
};

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isQualified, setIsQualified] = useState(false);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await api.get("/rankings");
        setRankings(response.data.rankings);
        setCurrentUser(response.data.currentUser);
        setIsQualified(response.data.isQualified);
      } catch (error) {
        console.error("Failed to fetch rankings:", error);
      }
    };
    fetchRankings();
  }, []);

  return (
    <Box
      sx={{
        padding: { xs: 0.5, sm: 1 },
        background: "#1E2A3A",
        minHeight: "100vh",
        pb: 8,
      }}
    >
      <Container
        sx={{
          width: "100%",
          px: { xs: 0.5, sm: 1 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            textAlign: "center",
            mb: { xs: 2, sm: 3 },
            mt: { xs: 4, sm: 5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Genius Ranking
        </Typography>

        {!isQualified ? (
          <Box
            sx={{
              backgroundColor: "#17202C",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              color: "#FFFFFF",
              marginBottom: "16px",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "8px" }}>
              레벨 5 달성 시 랭킹이 공개됩니다
            </Typography>
          </Box>
        ) : (
          <Box sx={{ marginBottom: "16px" }}>
            {rankings.map((ranking, index) => (
              <RankingCard
                key={index}
                rank={ranking.rank}
                username={ranking.username}
                score={ranking.score}
              />
            ))}
          </Box>
        )}
      </Container>
      <Navigationbar />
    </Box>
  );
};

export default RankingPage;
