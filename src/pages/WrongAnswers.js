import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HomeIcon from "@mui/icons-material/Home";
import LockIcon from "@mui/icons-material/Lock";
import api from "../utils/axiosConfig";
import Navigationbar from "../components/Navigationbar";

const WrongAnswers = () => {
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [userLevel, setUserLevel] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wrongAnswersResponse, levelResponse] = await Promise.all([
          api.get("/quiz/wrong_answers"),
          api.get("/user/level"),
        ]);
        setWrongAnswers(wrongAnswersResponse.data);
        setUserLevel(levelResponse.data.level);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartTest = async () => {
    try {
      if (wrongAnswers.length === 0) {
        alert("테스트할 단어가 없습니다.");
        return;
      }

      const response = await api.post("/quiz/start", {
        word_set_id: "wrong_answers",
        words: wrongAnswers.map((wa) => ({
          english: wa.question,
          korean: wa.correctAnswer,
        })),
      });

      if (response.status === 200) {
        localStorage.setItem("is_wrong_answers_test", "true");
        navigate("/quiz");
      }
    } catch (error) {
      console.error("Error starting test:", error);
      alert("테스트 시작에 실패했습니다.");
    }
  };

  const isLocked = userLevel < 3;

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
          }}
        >
          오답노트
        </Typography>

        {isLocked ? (
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
            <Typography variant="h6">
              레벨 3 달성 시 오답노트가 공개됩니다
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                backgroundColor: "#17202C",
                borderRadius: "12px",
                p: 3,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography sx={{ color: "#FFFFFF", mr: 2 }}>
                  단어 가리기
                </Typography>
                <Switch
                  checked={hideAnswers}
                  onChange={(e) => setHideAnswers(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#9b87f5",
                      "& + .MuiSwitch-track": {
                        backgroundColor: "#9b87f5",
                      },
                    },
                  }}
                />
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#1E2A3A",
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#FFFFFF", fontWeight: "bold" }}>
                        영단어
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#FFFFFF", fontWeight: "bold" }}
                      >
                        정답
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wrongAnswers.map((wrong, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "#FFFFFF" }}>
                          {wrong.question}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "#9b87f5",
                            visibility: hideAnswers ? "hidden" : "visible",
                          }}
                        >
                          {wrong.correctAnswer}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {wrongAnswers.length > 0 && (
              <Button
                variant="contained"
                onClick={handleStartTest}
                startIcon={<PlayArrowIcon />}
                sx={{
                  backgroundColor: "#9b87f5",
                  color: "#FFFFFF",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  position: "fixed",
                  bottom: "80px",
                  right: "20px",
                  "&:hover": {
                    backgroundColor: "rgba(155, 135, 245, 0.9)",
                  },
                }}
              >
                테스트 시작 ({wrongAnswers.length}단어)
              </Button>
            )}
          </>
        )}
      </Container>
      <Navigationbar />
    </Box>
  );
};

export default WrongAnswers;
