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
  timeout: 30000,  // 파일 업로드를 위해 타임아웃 증가
});

// 요청 인터셉터 추가
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // multipart/form-data인 경우 Content-Type 헤더 제거 (브라우저가 자동으로 설정)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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
    console.log('=== API 응답 상세 정보 ===');
    console.log('URL:', response.config.url);
    console.log('Method:', response.config.method);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', response.headers);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('=== API 에러 상세 정보 ===');
    if (error.response) {
      // 서버가 응답을 반환한 경우
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Headers:', error.response.headers);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('Request made but no response received');
      console.error('Request:', error.request);
    } else {
      // 요청 설정 중에 문제가 발생한 경우
      console.error('Error Message:', error.message);
    }
    console.error('Error Config:', error.config);
    
    if (error.response?.status === 401) {
      console.log("Unauthorized access, removing token");
      localStorage.removeItem("token");
      window.dispatchEvent(new CustomEvent("authError"));
    }
    
    return Promise.reject(error);
  }
);

export default instance;
