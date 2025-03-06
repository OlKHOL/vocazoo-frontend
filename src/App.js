import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Quiz from "./Quiz";
import WrongAnswers from "./pages/WrongAnswers";
import WordSetPage from "./pages/WordSetPage";
import LevelPage from "./pages/LevelPage";
import Rankings from "./pages/RankingPage";
import Navigationbar from "./components/Navigationbar";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isDevelopment) {
    return children;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <PrivateRoute>
                  <Quiz />
                </PrivateRoute>
              }
            />
            <Route
              path="/wrong-answers"
              element={
                <PrivateRoute>
                  <WrongAnswers />
                </PrivateRoute>
              }
            />
            <Route
              path="/wordset"
              element={
                <PrivateRoute>
                  <WordSetPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/level"
              element={
                <PrivateRoute>
                  <LevelPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/rankings"
              element={
                <PrivateRoute>
                  <Rankings />
                </PrivateRoute>
              }
            />
          </Routes>
          <Navigationbar />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
