import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utils/axiosConfig"; // axios 인스턴스 import
import { Box, Typography, Button } from "@mui/material";
import { useButtonFeedback } from "./hooks/useButtonFeedback";

// 색상 상수 수정
const colors = {
  primary: "#3797E5",
  background: "#1E2A3A",
  testBackground: "#f8f9fa", // 배경색 변경
  text: "#343a40", // 텍스트 색상 변경
  border: "#e9ecef",
};

// 메시지 컴포넌트
const Message = ({ text, isCorrect }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isCorrect ? "transparent" : "rgba(255, 107, 107, 0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      paddingTop: "40px",
      animation: "fadeInOut 1.5s ease-out forwards",
      zIndex: 1000,
      fontFamily: "Inter, sans-serif",
    }}
  >
    <div
      style={{
        color: isCorrect ? "#51CF66" : "white",
        fontSize: "32px",
        fontWeight: "600",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {text}
    </div>
  </div>
);

// 카운트다운 컴포넌트
const CountdownScreen = ({ count }) => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.testBackground,
      color: colors.text,
      fontSize: "5rem",
      fontWeight: "bold",
      fontFamily: "Inter, sans-serif",
    }}
  >
    {count}
  </div>
);

// 게임 화면 컴포넌트
const GameScreen = ({
  question,
  answer,
  setAnswer,
  submitAnswer,
  remainingTime,
  score,
  solvedCount,
  answerInputRef,
}) => (
  <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: colors.testBackground,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "Inter, sans-serif",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: "20px",
        right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Typography
        sx={{
          color: colors.text,
          fontWeight: "600",
          fontSize: "1.2rem",
          fontFamily: "Inter, sans-serif",
        }}
      >
        시간: {remainingTime}초
      </Typography>
    </Box>

    <Box
      sx={{
        position: "absolute",
        top: "20px",
        left: "20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <Typography
        sx={{
          color: colors.text,
          fontWeight: "600",
          fontSize: "1.2rem",
          fontFamily: "Inter, sans-serif",
        }}
      >
        점수: {score}
      </Typography>
    </Box>

    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: { xs: "24px", sm: "32px" },
        width: "90%",
        maxWidth: "500px",
        textAlign: "center",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "#343a40",
          fontWeight: "600",
          fontSize: { xs: "1.8rem", sm: "2.2rem" },
          mb: 4,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {question?.korean}
      </Typography>

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          submitAnswer();
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <input
          ref={answerInputRef}
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="영어 단어를 입력하세요"
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: "1.2rem",
            borderRadius: "8px",
            border: "1px solid #e9ecef",
            marginBottom: "20px",
            fontFamily: "Inter, sans-serif",
          }}
          autoFocus
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#6c63ff",
            color: "#FFFFFF",
            padding: "12px 24px",
            fontSize: "1.1rem",
            fontWeight: "600",
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: "Inter, sans-serif",
            "&:hover": {
              backgroundColor: "#5a52d5",
            },
          }}
        >
          제출
        </Button>
      </Box>
    </Box>

    <Typography
      sx={{
        position: "absolute",
        bottom: "20px",
        color: colors.text,
        fontWeight: "500",
        fontSize: "1rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      문제 {solvedCount + 1}/30
    </Typography>
  </Box>
);

// 종료 화면 컴포넌트
const EndScreen = ({ score }) => {
  const navigate = useNavigate();
  const playFeedback = useButtonFeedback();
  const isWrongAnswersTest =
    localStorage.getItem("is_wrong_answers_test") === "true";

  const handleReturn = () => {
    playFeedback();
    localStorage.removeItem("is_wrong_answers_test");
    navigate(isWrongAnswersTest ? "/" : "/wordset");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.testBackground,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: colors.text,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: { xs: "24px", sm: "32px" },
          width: "90%",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#343a40",
            fontWeight: "600",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            mb: 3,
            fontFamily: "Inter, sans-serif",
          }}
        >
          테스트 종료!
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: "#6c63ff", // 점수 색상 변경
            fontWeight: "bold",
            fontSize: { xs: "2.2rem", sm: "2.8rem" },
            mb: 4,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {score} 점
        </Typography>

        <Button
          variant="contained"
          onClick={handleReturn}
          sx={{
            backgroundColor: "#6c63ff", // 버튼 색상 변경
            color: "#FFFFFF",
            padding: { xs: "12px 24px", sm: "16px 32px" },
            fontSize: { xs: "1rem", sm: "1.2rem" },
            fontWeight: "600",
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: "Inter, sans-serif",
            "&:hover": {
              backgroundColor: "#5a52d5", // 호버 색상 변경
            },
          }}
        >
          {isWrongAnswersTest ? "홈으로 돌아가기" : "단어장으로 돌아가기"}
        </Button>
      </Box>
    </Box>
  );
};

const Quiz = () => {
  const [gameState, setGameState] = useState("countdown");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(30);
  const [countdown, setCountdown] = useState(3);
  const [solvedCount, setSolvedCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const answerInputRef = useRef(null);
  const navigate = useNavigate();

  // 카운트다운
  useEffect(() => {
    let countdownTimer;
    if (countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(countdownTimer);
  }, [countdown]);

  // 테스트 시작
  useEffect(() => {
    const startTestAndFetchQuestion = async () => {
      try {
        const wordSetId = localStorage.getItem("current_word_set_id");
        if (!wordSetId) {
          navigate("/");
          return;
        }

        const response = await api.post(
          "/quiz/start",
          {
            word_set_id: wordSetId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          console.error("테스트 시작 중 오류가 발생했습니다");
          return;
        }

        setGameState("playing");
        await fetchQuestion();
      } catch (error) {
        console.error("Error starting test:", error);
        navigate("/");
      }
    };

    startTestAndFetchQuestion();
  }, [gameState, navigate]);

  // 게임 종료 처리를 관리하는 useEffect
  useEffect(() => {
    const handleGameEnd = async () => {
      try {
        const finalScoreResponse = await api.get("/quiz/score");
        const finalScore = finalScoreResponse.data.score;
        setScore(finalScore);

        await api.post("/quiz/end", {
          score: finalScore,
          wrong_answers: wrongAnswers,
        });
      } catch (error) {
        console.error("Error in handleGameEnd:", error);
      }
    };

    if (gameState === "ended") {
      handleGameEnd();
    }
  }, [gameState, wrongAnswers]);

  // 점수 업데이트
  useEffect(() => {
    if (gameState === "playing") {
      const scoreTimer = setInterval(async () => {
        try {
          const response = await api.get("/quiz/score");
          const data = response.data;
          setScore(data.score);
          setRemainingTime(data.remaining_time);

          if (data.remaining_time <= 0) {
            clearInterval(scoreTimer);
            setGameState("ended");
          }
        } catch (error) {
          console.error("Error fetching score:", error);
          clearInterval(scoreTimer);
        }
      }, 100);

      return () => clearInterval(scoreTimer);
    }
  }, [gameState]);

  // 입력 필드 포커스
  useEffect(() => {
    if (gameState === "playing" && answerInputRef.current) {
      answerInputRef.current.focus();
    }
  }, [gameState, question]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get("/quiz/question");
      const data = response.data;

      if (Object.keys(data).length === 0) {
        return;
      }

      if (data.test_completed) {
        setGameState("ended");
      } else if (data.english) {
        setQuestion(data);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const submitAnswer = async () => {
    if (!question || !answer) return;

    try {
      const response = await api.post("/quiz/check", {
        question: question,
        answer: answer.trim(),
      });
      const data = response.data;

      if (data.result === "correct") {
        setMessage(data.message || "정답입니다!");
        setIsCorrect(true);
        setTimeout(() => setShowMessage(false), 1200);
      } else if (data.result === "wrong") {
        setWrongAnswers((prev) => [
          ...prev,
          {
            question: question.english,
            userAnswer: answer.trim(),
            correctAnswer: data.correct_answer,
          },
        ]);
        setMessage(`오답입니다. 정답은 "${data.correct_answer}" 입니다.`);
        setIsCorrect(false);
        setTimeout(() => setShowMessage(false), 1800);
      } else if (data.result === "time_over") {
        setGameState("ended");
        return;
      }

      setShowMessage(true);
      setSolvedCount((prev) => prev + 1);
      setAnswer("");
      fetchQuestion();
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.testBackground,
        overflow: "hidden",
      }}
    >
      {gameState === "countdown" && <CountdownScreen count={countdown} />}
      {gameState === "playing" && showMessage && (
        <Message text={message} isCorrect={isCorrect} />
      )}
      {gameState === "playing" && question && (
        <GameScreen
          question={question}
          answer={answer}
          setAnswer={setAnswer}
          submitAnswer={submitAnswer}
          remainingTime={remainingTime}
          score={score}
          solvedCount={solvedCount}
          answerInputRef={answerInputRef}
        />
      )}
      {gameState === "ended" && <EndScreen score={score} />}
    </div>
  );
};

export default Quiz;
