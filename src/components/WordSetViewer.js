import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import styled from "@emotion/styled";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import api from "../utils/axiosConfig";

const EditWordDialog = ({ open, onClose, wordSet, onSave }) => {
  const [words, setWords] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (wordSet && Array.isArray(wordSet.words)) {
      setWords([...wordSet.words]);
    }
  }, [wordSet]);

  const handleWordChange = (index, field, value) => {
    const newWords = [...words];
    newWords[index] = { ...newWords[index], [field]: value };
    setWords(newWords);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/admin/edit_word_set/${wordSet.id}`,
        { words },
        { headers: { Authorization: token } }
      );
      onSave(words);
      onClose();
    } catch (error) {
      console.error("Error saving words:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>단어장 수정</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>영단어</TableCell>
                <TableCell>뜻</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {words.map((word, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={word.english}
                      onChange={(e) =>
                        handleWordChange(index, "english", e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={word.korean}
                      onChange={(e) =>
                        handleWordChange(index, "korean", e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} variant="contained">
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const StageCard = styled(Card)({
  backgroundColor: "#17202C",
  color: "#FFFFFF",
  margin: "10px 0",
  width: "300px",
});

const StageContent = styled(CardContent)({
  padding: "16px",
});

const StageNumber = styled(Typography)({
  fontSize: "2.5rem",
  fontWeight: "bold",
  textAlign: "center",
  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
});

const WordCount = styled(Typography)({
  textAlign: "center",
  opacity: 0.9,
  marginBottom: "1rem",
});

const ViewButton = styled(Button)({
  backgroundColor: "#3797E5",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#2d7ac4",
  },
});

const HeaderContainer = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
  padding: "0 1rem",
});

const ActionButton = styled(Button)({
  margin: "0 8px",
  backgroundColor: "#3797E5",
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: "#2d7ac4",
  },
});

const DeleteButton = styled(IconButton)({
  position: "absolute",
  top: "10px",
  right: "10px",
  color: "rgba(255,255,255,0.8)",
  "&:hover": {
    color: "white",
    background: "rgba(255,0,0,0.2)",
  },
});

const WordSetViewer = () => {
  const [wordSets, setWordSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [wordDialogOpen, setWordDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSetForEdit, setSelectedSetForEdit] = useState(null);
  const [selectedWordSet, setSelectedWordSet] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const navigate = useNavigate();

  const fetchWordSets = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get_word_sets");
      setWordSets(response.data);

      const adminResponse = await api.get("/check_admin");
      setIsAdmin(adminResponse.data.is_admin);
    } catch (error) {
      console.error("Error fetching word sets:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setError("단어장을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordSets();
  }, [navigate]);

  const handleStartTest = async (wordSetId) => {
    try {
      const response = await api.post("/start_test", {
        word_set_id: wordSetId,
      });
      if (response.status === 200) {
        localStorage.setItem("current_word_set_id", wordSetId);
        navigate("/quiz");
      }
    } catch (error) {
      console.error("Error starting test:", error);
    }
  };

  const handleViewWords = async (wordSetId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/word_set/${wordSetId}`, {
        headers: { Authorization: token },
      });
      setSelectedSet(response.data);
      setWordDialogOpen(true);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const handleDelete = async (wordSetId) => {
    if (window.confirm("정말로 이 단어장을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/admin/delete_word_set/${wordSetId}`, {
          headers: { Authorization: token },
        });
        fetchWordSets();
      } catch (error) {
        console.error("Error deleting word set:", error);
      }
    }
  };

  const handleEdit = async (wordSet) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/word_set/${wordSet.id}`, {
        headers: { Authorization: token },
      });
      setSelectedSetForEdit(response.data);
      setEditDialogOpen(true);
    } catch (err) {
      setError("단어장 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleSaveEdit = async (updatedWords) => {
    try {
      const updatedWordSets = wordSets.map((ws) =>
        ws.id === selectedSetForEdit.id ? { ...ws, words: updatedWords } : ws
      );
      setWordSets(updatedWordSets);

      setSelectedSet((prev) =>
        prev?.id === selectedSetForEdit.id
          ? { ...prev, words: updatedWords }
          : prev
      );

      setEditDialogOpen(false);
      setSelectedSetForEdit(null);
    } catch (err) {
      setError("단어장 수정에 실패했습니다.");
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.get("/admin/export_word_sets", {
        headers: { Authorization: token },
      });
    } catch (error) {
      console.error("Error exporting word sets:", error);
    }
  };

  const handleCreateWordSet = async () => {
    try {
      await api.post("/admin/create_word_set");
      const response = await api.get("/get_word_sets");
      setWordSets(response.data);
    } catch (error) {
      setError("단어장 생성에 실패했습니다.");
    }
  };

  const handleViewWordSet = (wordSet) => {
    setSelectedWordSet(wordSet);
    setOpenDialog(true);
  };

  const handleManualUpdate = async () => {
    try {
      await api.post("/admin/update_word_set");
      window.location.reload();
    } catch (error) {
      console.error("Error updating word set:", error);
    }
  };

  const handleDeleteWordSet = async (wordSetId) => {
    if (!window.confirm("이 단어장을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await api.delete(`/admin/word_sets/${wordSetId}`);
      if (response.status === 200) {
        alert("단어장이 삭제되었습니다.");
        await fetchWordSets();
      }
    } catch (error) {
      console.error("Error deleting word set:", error);
      if (error.response?.status === 404) {
        alert("이미 삭제된 단어장입니다.");
        await fetchWordSets();
      } else {
        alert(error.response?.data?.error || "단어장 삭제에 실패했습니다.");
      }
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleViewCurrentWordSet = async () => {
    try {
      const response = await api.get("/word_set/current");
      setSelectedWordSet(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching current word set:", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        padding: 2,
        background: "#1E2A3A",
        minHeight: "100vh",
        color: "#FFFFFF",
      }}
    >
      {/* 헤더 섹션 */}
      <HeaderContainer>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
          sx={{
            backgroundColor: "#9b87f5",
            color: "#FFFFFF",
            padding: { xs: "8px 16px", sm: "12px 24px" },
            fontSize: { xs: "12px", sm: "14px" },
            borderRadius: "15px",
            textTransform: "none",
            width: { xs: "auto", sm: "25%" },
            minWidth: { xs: "80px", sm: "120px" },
            boxShadow: "0px 4px 10px rgba(155, 135, 245, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(155, 135, 245, 0.9)",
            },
          }}
        >
          Home
        </Button>
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            color: "#F8F9FA",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          VOCAZOO
        </Typography>
        <Box width={{ xs: "80px", sm: "100px" }} />
      </HeaderContainer>

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "0 auto",
          mt: 4,
          px: { xs: 1, sm: 2 },
        }}
      >
        {/* 현재 활성화된 단어장 */}
        {wordSets
          .filter((ws) => ws.is_active)
          .map((wordSet, index) => (
            <Box
              key={index}
              sx={{
                mb: 6,
                backgroundColor: "#17202C",
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  mb: 3,
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: "#FFFFFF",
                    textAlign: { xs: "left", sm: "center" },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  }}
                >
                  현재 활성화된 단어장
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mr: { xs: 0, sm: 2 },
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "#FFFFFF" }}>
                      단어 가리기
                    </Typography>
                    <Switch
                      checked={hideAnswers}
                      onChange={(e) => setHideAnswers(e.target.checked)}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#3797E5",
                          "& + .MuiSwitch-track": {
                            backgroundColor: "#3797E5",
                          },
                        },
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      justifyContent: { xs: "flex-start", sm: "flex-end" },
                      flex: { xs: "1", sm: "0 0 auto" },
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleStartTest(wordSet.id)}
                      startIcon={
                        <PlayArrowIcon
                          sx={{ fontSize: { xs: "24px", sm: "28px" } }}
                        />
                      }
                      sx={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        backgroundColor: "#9b87f5",
                        padding: { xs: "16px 32px", sm: "20px 40px" },
                        fontSize: { xs: "18px", sm: "22px" },
                        fontWeight: "700",
                        borderRadius: "15px",
                        textTransform: "none",
                        boxShadow: "0px 4px 20px rgba(155, 135, 245, 0.3)",
                        zIndex: 1000,
                        "&:hover": {
                          backgroundColor: "#8a74f8",
                          transform: "translateY(-2px)",
                          boxShadow: "0px 6px 25px rgba(155, 135, 245, 0.4)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      시작하기
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => handleEdit(wordSet)}
                          sx={{
                            backgroundColor: "#3797E5",
                            fontSize: { xs: "12px", sm: "14px" },
                            padding: { xs: "6px 12px", sm: "8px 16px" },
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleExport()}
                          sx={{
                            backgroundColor: "#3797E5",
                            fontSize: { xs: "12px", sm: "14px" },
                            padding: { xs: "6px 12px", sm: "8px 16px" },
                          }}
                        >
                          내보내기
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  backgroundColor: "#1E2A3A",
                  overflowX: "auto",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          width: "50%",
                          fontSize: { xs: "16px", sm: "20px" },
                          padding: { xs: "12px", sm: "20px" },
                          fontWeight: "500",
                        }}
                      >
                        영단어
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#FFFFFF",
                          width: "50%",
                          textAlign: "right",
                          fontSize: { xs: "16px", sm: "20px" },
                          padding: { xs: "12px", sm: "20px" },
                          fontWeight: "500",
                        }}
                      >
                        뜻
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wordSet.words.map((word, idx) => (
                      <TableRow
                        key={idx}
                        onMouseEnter={() => setHoveredWord(idx)}
                        onMouseLeave={() => setHoveredWord(null)}
                      >
                        <TableCell
                          sx={{
                            color: "#FFFFFF",
                            padding: { xs: "12px", sm: "20px" },
                            fontSize: { xs: "16px", sm: "20px" },
                            fontWeight: "400",
                          }}
                        >
                          {word.english}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "#3797E5",
                            visibility: hideAnswers ? "hidden" : "visible",
                            padding: { xs: "12px", sm: "20px" },
                            fontSize: { xs: "16px", sm: "20px" },
                            fontWeight: "400",
                            textAlign: "right",
                          }}
                        >
                          {word.korean}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}

        {/* 관리자 버튼들 */}
        {isAdmin && (
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
              gap: 2,
              mb: 4,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreateWordSet}
              sx={{
                backgroundColor: "#3797E5",
                fontSize: { xs: "12px", sm: "14px" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
              }}
              startIcon={<AddIcon />}
            >
              새로운 단어장 추가
            </Button>
            <Button
              variant="contained"
              onClick={handleManualUpdate}
              sx={{
                backgroundColor: "#3797E5",
                fontSize: { xs: "12px", sm: "14px" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
              }}
            >
              단어장 교체
            </Button>
          </Box>
        )}

        {/* 비활성화된 단어장 목록 */}
        <Typography
          variant="h5"
          sx={{
            color: "#FFFFFF",
            mb: 3,
            fontSize: { xs: "1.2rem", sm: "1.5rem" },
          }}
        >
          단어장 목록
        </Typography>
        <Grid container spacing={2}>
          {wordSets
            .filter((ws) => !ws.is_active)
            .map((wordSet, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: "#17202C", height: "100%" }}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#FFFFFF",
                        mb: 2,
                        fontSize: { xs: "1rem", sm: "1.25rem" },
                      }}
                    >
                      단어장 #{wordSet.id}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        mb: 1,
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      단어 수: {wordSet.words.length}개
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      p: 2,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleViewWords(wordSet.id)}
                      sx={{
                        backgroundColor: "#3797E5",
                        fontSize: { xs: "12px", sm: "14px" },
                        padding: { xs: "6px 12px", sm: "8px 16px" },
                      }}
                    >
                      단어 보기
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="contained"
                          onClick={() => handleEdit(wordSet)}
                          sx={{
                            backgroundColor: "#3797E5",
                            fontSize: { xs: "12px", sm: "14px" },
                            padding: { xs: "6px 12px", sm: "8px 16px" },
                          }}
                        >
                          수정
                        </Button>
                        <IconButton
                          onClick={() => handleDeleteWordSet(wordSet.id)}
                          sx={{ color: "#FF6B6B" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>

      {/* Dialogs는 그대로 유지 */}
      <EditWordDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        wordSet={selectedSetForEdit}
        onSave={handleSaveEdit}
      />

      <Dialog
        open={wordDialogOpen}
        onClose={() => setWordDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>단어 목록</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>영단어</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>뜻</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedSet?.words.map((word, index) => (
                  <TableRow key={index}>
                    <TableCell>{word.english}</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {word.korean}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWordDialogOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WordSetViewer;
