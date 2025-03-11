import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Container,
  Avatar,
} from "@mui/material";
import Navigationbar from "../components/Navigationbar";
import api from "../utils/axiosConfig";

const AccountPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const fetchData = async () => {
      try {
        console.log("Fetching account data...");
        const response = await api.get("/auth/account");
        
        if (mounted.current) {
          console.log("Account data received:", response.data);
          setUserData(response.data);
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
  }, [navigate]);

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
    <Box sx={{ minHeight: "100vh", background: "#1E2A3A" }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            pt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "#9b87f5",
              fontSize: "2rem",
              mb: 2,
            }}
          >
            {userData.username ? userData.username.charAt(0) : "?"}
          </Avatar>
          <Typography
            variant="h4"
            sx={{
              color: "#FFFFFF",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {userData.username || "사용자"}
          </Typography>
          <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
            레벨: {userData.level || 0}
          </Typography>
          <Typography sx={{ color: "#FFFFFF", mb: 1 }}>
            경험치: {userData.exp || 0}
          </Typography>
          <Typography sx={{ color: "#FFFFFF", mb: 3 }}>
            점수: {userData.current_score || 0}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            sx={{
              backgroundColor: "#FF4081",
              "&:hover": { backgroundColor: "#E91E63" },
            }}
          >
            로그아웃
          </Button>
        </Box>
      </Container>
      <Navigationbar />
    </Box>
  );
};

export default AccountPage;
