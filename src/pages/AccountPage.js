import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Avatar,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const mounted = useRef(false);
  const { userData, logout, checkAuth } = useAuth();

  useEffect(() => {
    mounted.current = true;

    const fetchData = async () => {
      try {
        console.log("Checking authentication and refreshing user data...");
        await checkAuth();
        if (mounted.current) {
          setError(null);
        }
      } catch (err) {
        console.error("Failed to fetch account data:", err.message);
        if (mounted.current) {
          setError(err.response?.data?.message || err.message || "서버에서 응답이 없습니다.");
          if (err.response?.status === 401) {
            navigate("/login");
          }
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    fetchData();

    return () => {
      mounted.current = false;
    };
  }, [navigate, checkAuth]);

  const handleLogout = () => {
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

  if (!userData) {
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
        <Typography>데이터를 불러올 수 없습니다.</Typography>
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
              {userData.username ? userData.username.charAt(0).toUpperCase() : "?"}
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
              {userData.username || "사용자"}
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
                레벨 {userData.level || 1}
              </Typography>
              
              <Box
                sx={{
                  backgroundColor: "rgba(155, 135, 245, 0.1)",
                  borderRadius: "10px",
                  p: 3,
                  mb: 2,
                }}
              >
                <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
                  경험치: {userData.exp || 0}
                </Typography>
                <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
                  현재 점수: {userData.current_score || 0}
                </Typography>
              </Box>
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
