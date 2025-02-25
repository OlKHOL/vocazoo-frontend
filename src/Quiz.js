import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "./utils/axiosConfig"; // axios 인스턴스 import
import { Box, Typography, Button } from "@mui/material";
import { useButtonFeedback } from "./hooks/useButtonFeedback";

// 색상 상수 수정
const colors = {
  primary: "#3797E5",
  background: "#1E2A3A",
  testBackground: "#17202C",
  text: "#FFFFFF",
  border: "#2A3744",
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
    }}
  >
    <div
      style={{
        color: isCorrect ? "#51CF66" : "white",
        fontSize: "32px",
        fontWeight: "bold",
        textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
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
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "17202C",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeOut 0.5s ease-out forwards",
    }}
  >
    <div
      key={count}
      style={{
        fontSize: "180px",
        fontWeight: "900",
        color: "white",
        animation: "fadeOut 0.8s ease-out forwards",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
      }}
    >
      {count}
    </div>
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
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.testBackground,
      color: colors.text,
      fontSize: "20px",
      fontWeight: "bold",
      overflow: "hidden",
    }}
  >
    {/* 현재 문제 수 */}
    <div
      style={{
        position: "absolute",
        top: "73px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "25px",
        opacity: "50%",
      }}
    >
      {solvedCount}/10
    </div>

    {/* 문제 */}
    <div
      style={{
        position: "absolute",
        top: "174px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "50px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {question.english}
    </div>

    {/* 남은 시간 */}
    <div
      style={{
        position: "absolute",
        top: "274px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "25px",
        opacity: "80%",
      }}
    >
      {Math.floor(remainingTime)} 초
    </div>

    {/* 현재 점수 */}
    <div
      style={{
        position: "absolute",
        top: "324px",
        left: "50%",
        transform: "translateX(-50%)",
        fontSize: "20px",
        opacity: "80%",
      }}
    >
      {score} 점
    </div>

    {/* 입력 필드 */}
    <input
      ref={answerInputRef}
      type="text"
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          submitAnswer();
        }
      }}
      style={{
        position: "absolute",
        top: "374px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        padding: "12px",
        fontSize: "18px",
        textAlign: "center",
        borderRadius: "8px",
        outline: "none",
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
      placeholder="한글 뜻을 입력하세요"
    />
  </div>
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
      }}
    >
      <Box
        sx={{
          backgroundColor: "#17202C",
          borderRadius: "12px",
          padding: { xs: "24px", sm: "32px" },
          width: "90%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
            mb: 3,
          }}
        >
          테스트 종료!
        </Typography>

        <Typography
          variant="h3"
          sx={{
            color: "#9b87f5",
            fontWeight: "bold",
            fontSize: { xs: "2.2rem", sm: "2.8rem" },
            mb: 4,
          }}
        >
          {score} 점
        </Typography>

        <Button
          variant="contained"
          onClick={handleReturn}
          sx={{
            backgroundColor: "#9b87f5",
            color: "#FFFFFF",
            padding: { xs: "12px 24px", sm: "16px 32px" },
            fontSize: { xs: "1rem", sm: "1.2rem" },
            fontWeight: "bold",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(155, 135, 245, 0.9)",
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
      if (gameState === "countdown" && countdown === 1) {
        const token = localStorage.getItem("token");
        const word_set_id = localStorage.getItem("current_word_set_id");

        const response = await fetch("http://localhost:5000/start_test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ word_set_id: parseInt(word_set_id) }),
        });

        if (!response.ok) {
          console.error("테스트 시작 중 오류가 발생했습니다");
          return;
        }
        setGameState("playing");
        fetchQuestion();
      }
    };

    startTestAndFetchQuestion();
  }, [gameState, countdown]);

  // 게임 종료 처리를 관리하는 useEffect
  useEffect(() => {
    const handleGameEnd = async () => {
      try {
        const finalScoreResponse = await api.get("/get_final_score");
        const finalScore = finalScoreResponse.data.final_score;
        setScore(finalScore);

        await api.post("/save_test_result", {
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
          const response = await api.get("/get_score");
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
      const response = await api.get("/get_question");
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
      const response = await api.post("/check_answer", {
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
