import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import api from "../utils/axiosConfig";

function AccountModal({ open, onClose }) {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [score, setScore] = useState(0); // 점수 상태 추가
  const [registerDate, setRegisterDate] = useState(""); // 등록 날짜 상태 추가

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/account");
        setUsername(response.data.username);
        setScore(response.data.score); // 현재 점수 설정
        setRegisterDate(response.data.created_at); // 등록 날짜 설정
      } catch (error) {
        setError("사용자 정보를 불러오는데 실패했습니다.");
      }
    };

    if (open) {
      fetchUserInfo();
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://vocazoo.co.kr/account",
        { username: newUsername },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUsername(newUsername);
      setNewUsername("");
      onClose();
    } catch (error) {
      setError(
        error.response?.data?.message || "사용자명 변경에 실패했습니다."
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>계정 관리</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Typography variant="subtitle1">현재 사용자명:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {username}
          </Typography>
          <Typography variant="subtitle1">등록 날짜:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {registerDate}
          </Typography>
          <Typography variant="subtitle1">현재 점수:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {score} 점
          </Typography>
          <TextField
            fullWidth
            label="새로운 사용자명"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            변경하기
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AccountModal;
