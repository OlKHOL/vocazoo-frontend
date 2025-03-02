import axios from "axios";

// 현재 환경에 따른 baseURL 설정
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://vocazoo.co.kr"
    : "http://localhost:5000";

console.log("API baseURL:", baseURL);
console.log("Current environment:", process.env.NODE_ENV);

const instance = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    console.log(
      "API Request:",
      config.method.toUpperCase(),
      config.url,
      config.data
    );
    const token = localStorage.getItem("token");
    if (token) {
      // Bearer 접두사가 없는 경우에만 추가
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "API Response Error:",
      error.response?.status,
      error.response?.data
    );
    if (error.response?.status === 401) {
      // 401 에러가 발생해도 로그인 페이지로 리다이렉트하지 않음
      console.error("Authentication error:", error);
    }
    return Promise.reject(error);
  }
);

export default instance;
