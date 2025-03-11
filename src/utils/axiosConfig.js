import axios from "axios";

// 환경 변수에서 baseURL 설정
const baseURL = process.env.REACT_APP_API_URL || "https://api.vocazoo.co.kr";

console.log("API baseURL:", baseURL);
console.log("Current environment:", process.env.NODE_ENV);

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  // CORS 관련 설정
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // CORS preflight 요청 최적화
    if (config.method === "options") {
      config.headers["Access-Control-Request-Method"] = "GET, POST, PUT, DELETE";
      config.headers["Access-Control-Request-Headers"] = "Authorization, Content-Type";
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("authError"));
    }
    return Promise.reject(error);
  }
);

// 전역 타임아웃 설정
instance.defaults.timeout = 10000;

export default instance;
