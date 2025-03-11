import axios from "axios";

// 환경 변수에서 baseURL 설정
const baseURL = process.env.REACT_APP_API_URL || "https://api.vocazoo.co.kr";

console.log("API baseURL:", baseURL);
console.log("Current environment:", process.env.NODE_ENV);

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => {
    console.log("[API Response]", response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error("[Response Error]", error.config?.url, error.message);
    
    if (error.response?.status === 401) {
      console.log("Unauthorized access, removing token");
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("authError"));
    }
    
    return Promise.reject(error);
  }
);

export default instance;
