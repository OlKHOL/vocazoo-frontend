import axios from "axios";

// 환경 변수에서 baseURL 설정
const baseURL = process.env.REACT_APP_API_URL || "https://api.vocazoo.co.kr";

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

    // 401 에러 처리
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // 422 에러 처리
    if (error.response?.status === 422) {
      console.error("Token verification failed:", error.response.data);
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default instance;
