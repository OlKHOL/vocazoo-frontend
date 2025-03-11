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
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const navigate = useNavigate();
  const playFeedback = useButtonFeedback();

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const response = await api.get("/auth/account");
        console.log("User data response:", response.data);
        
        if (isMounted) {
          if (!response.data) {
            throw new Error("서버에서 데이터를 받지 못했습니다.");
          }
          setUserData(response.data);
          setNewUsername(response.data.username || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) {
          const errorMessage = error.response?.data?.message || error.message || "사용자 정보를 불러오는데 실패했습니다.";
          setError(errorMessage);
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleUpdateUsername = async () => {
    try {
      playFeedback();
      const response = await api.post("/auth/username", { username: newUsername });
      if (response.data) {
        setUserData((prev) => ({ ...prev, username: newUsername }));
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error updating username:", error);
      const errorMessage = error.response?.data?.message || error.message || "사용자명 변경에 실패했습니다.";
      setError(errorMessage);
    }
  };

  const handleLogout = () => {
    playFeedback();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#1E2A3A",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#9b87f5" }} />
        <Typography sx={{ color: "#FFFFFF" }}>로딩 중...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#1E2A3A",
          flexDirection: "column",
          gap: 2,
          p: 3,
        }}
      >
        <Typography color="error" align="center" sx={{ color: "#FF6B6B" }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: "#9b87f5",
            "&:hover": { backgroundColor: "#8a74f8" },
          }}
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "#1E2A3A",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography sx={{ color: "#FFFFFF" }}>
          사용자 정보를 불러올 수 없습니다.
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{
            backgroundColor: "#9b87f5",
            "&:hover": { backgroundColor: "#8a74f8" },
          }}
        >
          새로고침
        </Button>
      </Box>
    );
  }

  const { username = "사용자", level = 1, exp = 0, current_score = 0 } = userData;

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
                레벨: {level}
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

            <Box sx={{ p: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "#FFFFFF", opacity: 0.7 }}>
                  현재 경험치
                </Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  {exp}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "#FFFFFF", opacity: 0.7 }}>
                  현재 점수
                </Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                  {current_score}
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
