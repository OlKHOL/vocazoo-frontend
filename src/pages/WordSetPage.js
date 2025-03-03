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
} from "@mui/material";
import api from "../utils/axiosConfig";

const WordSetPage = () => {
  const [wordSets, setWordSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWordSets = async () => {
      try {
        const response = await api.get("/admin/word_sets");
        setWordSets(response.data);
      } catch (error) {
        console.error("Error fetching word sets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWordSets();
  }, []);

  const handleStartTest = async (wordSetId) => {
    try {
      const response = await api.post("/quiz/start", {
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

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1E2A3A",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#17202C",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "16px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#FFFFFF",
            marginBottom: "24px",
            fontFamily: "'Noto Sans KR', sans-serif",
          }}
        >
          단어장 목록
        </Typography>

        <Grid container spacing={2}>
          {wordSets.map((wordSet, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "#1E2A3A",
                  color: "#FFFFFF",
                }}
              >
                <CardContent>
                  <Typography variant="h6">단어장 {index + 1}</Typography>
                  <Typography>단어 수: {wordSet.words.length}</Typography>
                  <Typography>
                    생성일: {new Date(wordSet.created_at).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "16px",
                      backgroundColor: "#3797E5",
                      "&:hover": {
                        backgroundColor: "#2d7ac4",
                      },
                    }}
                    onClick={() => handleStartTest(wordSet.id)}
                  >
                    테스트 시작
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default WordSetPage;
