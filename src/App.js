import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./Quiz";
import Login from "./components/Login";
import Register from "./components/Register";
import TestHistory from "./TestHistory";
import WordSetViewer from "./components/WordSetViewer";
import ProtectedRoute from "./components/ProtectedRoute";
import WordSetPage from "./pages/WordSetPage";
import WrongAnswers from "./pages/WrongAnswers";
import AccountPage from "./pages/AccountPage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import RankingPage from "./pages/RankingPage";
import LevelPage from "./pages/LevelPage";
import AdminPage from "./pages/AdminPage";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",
    allVariants: {
      fontFamily: "Inter, sans-serif",
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 보호된 라우트 */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wordset"
            element={
              <ProtectedRoute>
                <WordSetViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wrong-answers"
            element={
              <ProtectedRoute>
                <WrongAnswers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rankings"
            element={
              <ProtectedRoute>
                <RankingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/level"
            element={
              <ProtectedRoute>
                <LevelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* 알 수 없는 경로는 홈으로 리다이렉트 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
