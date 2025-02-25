import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosConfig";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await api.post("/register", { username, password });
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다."
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
          회원가입
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
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            회원가입
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link
              component="button"
              onClick={() => navigate("/login")}
              sx={{
                color: "#3797E5",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              이미 계정이 있으신가요? 로그인
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Register;
