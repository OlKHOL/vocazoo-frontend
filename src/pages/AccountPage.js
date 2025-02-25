import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Avatar,
  Divider,
} from "@mui/material";
import Navigationbar from "../components/Navigationbar";
import { useButtonFeedback } from "../hooks/useButtonFeedback";
import api from "../utils/axiosConfig";

const AccountPage = () => {
  const [userData, setUserData] = useState({
    username: "",
    stats: {
      currentScore: 0,
      totalTests: 0,
      averageScore: 0,
    },
    createdAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate();
  const playFeedback = useButtonFeedback();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/account/info");
        setUserData(response.data);
        setNewUsername(response.data.username);
      } catch (error) {
        setError("Error fetching user data: " + error.message);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateUsername = async () => {
    playFeedback();
    try {
      await api.post("/update_username", { username: newUsername });
      setUserData((prev) => ({ ...prev, username: newUsername }));
      setOpenDialog(false);
    } catch (error) {
      setError("Error updating username: " + error.message);
    }
  };

  const handleLogout = () => {
    playFeedback();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#1E2A3A",
        }}
      >
        <CircularProgress />
      </Box>
    );

  const { username = "사용자", stats = {}, createdAt } = userData || {};
  const { currentScore = 0, totalTests = 0, averageScore = 0 } = stats;

  return (
    <Box sx={{ minHeight: "100vh", background: "#1E2A3A", pb: 8 }}>
      <Container maxWidth="sm">
        <Box sx={{ pt: 4, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
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
              {username.charAt(0)}
            </Avatar>
            <Typography
              variant="h4"
              sx={{
                color: "#FFFFFF",
                fontWeight: "bold",
                fontSize: { xs: "1.8rem", sm: "2.2rem" },
                mb: 1,
              }}
            >
              {username}
            </Typography>
            <Button
              onClick={() => {
                playFeedback();
                setOpenDialog(true);
              }}
              variant="outlined"
              size="small"
              sx={{
                color: "#9b87f5",
                borderColor: "#9b87f5",
                "&:hover": {
                  borderColor: "#9b87f5",
                  backgroundColor: "rgba(155, 135, 245, 0.1)",
                },
              }}
            >
              이름 변경
            </Button>
          </Box>

          <Box
            sx={{
              backgroundColor: "#17202C",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                sx={{
                  color: "#9b87f5",
                  fontSize: "0.9rem",
                  mb: 2,
                }}
              >
                가입일: {new Date(createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            <Box sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "#FFFFFF", opacity: 0.7 }}>
                  현재 점수
                </Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  {currentScore.toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "#FFFFFF", opacity: 0.7 }}>
                  평균 점수
                </Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  {averageScore.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: "#FFFFFF", opacity: 0.7 }}>
                  총 테스트
                </Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  {totalTests}회
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={handleLogout}
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#FF4081",
              color: "#FFFFFF",
              py: 1.5,
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#E91E63",
              },
            }}
          >
            로그아웃
          </Button>
        </Box>
      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#17202C",
            color: "#FFFFFF",
          },
        }}
      >
        <DialogTitle>사용자명 변경</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="새 사용자명"
            type="text"
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#FFFFFF",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.23)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255, 255, 255, 0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              playFeedback();
              setOpenDialog(false);
            }}
            sx={{ color: "#FFFFFF" }}
          >
            취소
          </Button>
          <Button onClick={handleUpdateUsername} sx={{ color: "#9b87f5" }}>
            변경
          </Button>
        </DialogActions>
      </Dialog>

      <Navigationbar />
    </Box>
  );
};

export default AccountPage;
