import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import api from "../utils/axiosConfig";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "로그인 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#1E2A3A",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: "#FFFFFF",
          fontWeight: "bold",
          textAlign: "center",
          mb: 6,
          fontSize: { xs: "2.5rem", sm: "3.5rem" },
        }}
      >
        VOCAZOO
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#17202C",
          borderRadius: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#FFFFFF",
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
          }}
        >
          로그인
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                color: "#FFFFFF",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#9b87f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#9b87f5",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "#9b87f5",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "#FFFFFF",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "#9b87f5",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#9b87f5",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
                "&.Mui-focused": {
                  color: "#9b87f5",
                },
              },
            }}
          />

          {successMessage && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}

          {error && (
            <Typography
              color="error"
              sx={{ mb: 2, textAlign: "center", color: "#FF6B6B" }}
            >
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 3,
              backgroundColor: "#9b87f5",
              color: "#FFFFFF",
              padding: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "0px 4px 10px rgba(155, 135, 245, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(155, 135, 245, 0.9)",
              },
            }}
          >
            로그인
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link
              component="button"
              onClick={() => navigate("/register")}
              sx={{
                color: "#3797E5",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              회원가입하기
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default Login;
