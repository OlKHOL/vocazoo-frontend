import React, { useState, useEffect } from "react";
import api from "./utils/axiosConfig";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// 날짜 형식화 함수 추가
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

function TestHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/test_history");
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching history:", error);
        setError("테스트 기록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm("이 테스트 기록을 삭제하시겠습니까?")) {
      try {
        const response = await api.delete(`/delete_test_record/${recordId}`);
        if (response.status === 200) {
          setHistory(history.filter((test) => test.id !== recordId));
          alert("테스트 기록이 삭제되었습니다.");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("기록 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 2,
        mb: 2,
        backgroundColor: "#1E2A3A",
        minHeight: "100vh",
        color: "#FFFFFF",
        padding: "16px",
      }}
    >
      <Paper
        sx={{
          p: 2,
          backgroundColor: "#17202C",
          color: "#FFFFFF",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          테스트 기록
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#FFFFFF" }}>날짜</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>점수</TableCell>
                <TableCell sx={{ color: "#FFFFFF" }}>오답 목록</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell sx={{ color: "#FFFFFF" }}>
                    {formatDateTime(record.completed_at)}
                  </TableCell>
                  <TableCell sx={{ color: "#FFFFFF" }}>
                    {record.score}
                  </TableCell>
                  <TableCell sx={{ color: "#FFFFFF" }}>
                    {record.wrong_answers.map((wrong, index) => (
                      <div key={index}>
                        {wrong.question} - 입력: {wrong.userAnswer}, 정답:{" "}
                        {wrong.correctAnswer}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}

export default TestHistory;
