import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "./utils/axiosConfig";

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateUsername = (username) => {
    if (username.length < 2) return "이름은 2자 이상이어야 합니다";
    // 한글, 영문, 숫자만 허용하는 정규식
    if (!/^[가-힣a-zA-Z0-9]+$/.test(username)) {
      return "이름은 한글, 영문, 숫자만 사용할 수 있습니다";
    }
    return null;
  };

  const validatePassword = (password) => {
    if (password.length < 4) return "비밀번호는 4자 이상이어야 합니다";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        username,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        alert("회원가입 성공!");
        onRegisterSuccess(); // 회원가입 성공 시 콜백
      } else {
        setError("회원가입 실패");
      }
    } catch (error) {
      console.error("Register error:", error);
      setError(
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          color: "#4C6EF5",
          fontFamily: "'Gaegu', 'Hi Melody', sans-serif",
        }}
      >
        회원가입
      </h2>
      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "15px",
            padding: "10px",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "0 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          회원가입
        </button>
      </form>
      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          padding: "0 30px 0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <span
          style={{
            color: "#868e96",
            fontFamily: "'Gaegu', 'Hi Melody', sans-serif",
          }}
        >
          이미 계정이 있으신가요?{" "}
        </span>
        <Link
          to="/login"
          style={{
            display: "inline-block",
            padding: "8px 16px",
            backgroundColor: "#4C6EF5",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            marginLeft: "10px",
            fontFamily: "'Gaegu', 'Hi Melody', sans-serif",
          }}
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "90%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontSize: "16px",
};

const buttonStyle = {
  width: "90%",
  padding: "10px",
  backgroundColor: "#4C6EF5",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

export default Register;
