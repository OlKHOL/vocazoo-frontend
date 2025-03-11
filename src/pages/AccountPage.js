import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Avatar,
  Paper,
  LinearProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/axiosConfig";

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const navigate = useNavigate();
  const { userData, logout, checkAuth, isAuthenticated } = useAuth();
  const [levelProgress, setLevelProgress] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("[AccountPage] Starting to load user data...");
        if (!localStorage.getItem("token")) {
          console.log("[AccountPage] No token found, redirecting to login");
          navigate("/login");
          return;
        }

        console.log("[AccountPage] Checking authentication and refreshing user data...");
        await checkAuth();

        // Fetch additional account information
        console.log("[AccountPage] Fetching account information...");
        const response = await api.get("/account/info");
        console.log("[AccountPage] Account data received:", response.data);
        setAccountData(response.data);

        // Calculate level progress
        const totalExpForLevel = Math.pow(response.data.level * 2, 2) * 100;
        const progress = (response.data.exp / totalExpForLevel) * 100;
        console.log("[AccountPage] Level progress calculated:", progress);
        setLevelProgress(progress);

        setError(null);
      } catch (err) {
        console.error("[AccountPage] Error loading account data:", err);
        setError(err.response?.data?.message || err.message || "서버에서 응답이 없습니다.");
        if (err.response?.status === 401) {
          console.log("[AccountPage] Unauthorized, redirecting to login");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate, checkAuth]);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      console.log("[AccountPage] User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = () => {
    console.log("[AccountPage] Logging out...");
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#1E2A3A",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#9b87f5" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#1E2A3A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          gap: 2,
          p: 3,
        }}
      >
        <Typography color="error">오류가 발생했습니다: {error}</Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{ backgroundColor: "#9b87f5" }}
        >
          로그인 페이지로 이동
        </Button>
      </Box>
    );
  }

  if (!accountData) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#1E2A3A",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
        }}
      >
        <Typography>사용자 데이터를 불러올 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", background: "#1E2A3A", py: 4 }}>
      <Container maxWidth="sm">
        <Paper
          sx={{
            backgroundColor: "#17202C",
            borderRadius: "20px",
            p: 4,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                backgroundColor: "#9b87f5",
                fontSize: "2.5rem",
                mb: 3,
              }}
            >
              {accountData.username ? accountData.username.charAt(0).toUpperCase() : "?"}
            </Avatar>
            
            <Typography
              variant="h4"
              sx={{
                color: "#FFFFFF",
                fontWeight: "bold",
                mb: 3,
                textAlign: "center",
              }}
            >
              {accountData.username || "사용자"}
            </Typography>

            <Box sx={{ width: "100%", mb: 4 }}>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: "1.2rem",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                레벨 {accountData.level || 1}
              </Typography>
              
              <Box sx={{ width: "100%", mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={levelProgress}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "rgba(155, 135, 245, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#9b87f5",
                      borderRadius: 5,
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: "#FFFFFF",
                    fontSize: "0.8rem",
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  {accountData.exp || 0} EXP
                </Typography>
              </Box>
              
              <Box
                sx={{
                  backgroundColor: "rgba(155, 135, 245, 0.1)",
                  borderRadius: "10px",
                  p: 3,
                  mb: 2,
                }}
              >
                <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
                  현재 점수: {accountData.current_score || 0}점
                </Typography>
                <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
                  완료한 테스트: {accountData.completed_tests || 0}회
                </Typography>
              </Box>

              {accountData.is_admin && (
                <Button
                  variant="contained"
                  onClick={() => navigate("/admin/upload")}
                  sx={{
                    backgroundColor: "#9b87f5",
                    color: "#FFFFFF",
                    padding: "12px 24px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    borderRadius: "12px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#8b77e5",
                    },
                    width: "100%",
                    mb: 2,
                  }}
                >
                  단어 업로드
                </Button>
              )}

              {accountData.badges && accountData.badges.length > 0 && (
                <Box
                  sx={{
                    backgroundColor: "rgba(155, 135, 245, 0.1)",
                    borderRadius: "10px",
                    p: 3,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      mb: 2,
                      fontWeight: "bold",
                    }}
                  >
                    획득한 뱃지
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {accountData.badges.map((badge, index) => (
                      <Box
                        key={index}
                        sx={{
                          backgroundColor: "#9b87f5",
                          borderRadius: "5px",
                          p: 1,
                          color: "#FFFFFF",
                        }}
                      >
                        {badge}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#FF4081",
                color: "#FFFFFF",
                padding: "12px 24px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "12px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#E91E63",
                },
                width: "100%",
                maxWidth: "200px",
              }}
            >
              로그아웃
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AccountPage; 