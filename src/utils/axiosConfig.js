import axios from "axios";

const instance = axios.create({
  baseURL: "http://vocazoo.co.kr",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
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
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 401 에러가 발생해도 로그인 페이지로 리다이렉트하지 않음
      console.error("Authentication error:", error);
    }
    return Promise.reject(error);
  }
);

export default instance;
