import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18에서는 react-dom/client를 사용
import './index.css'; // 스타일 파일 (선택사항)
import App from './App'; // App 컴포넌트 (메인 컴포넌트)

// React 18에서는 createRoot를 사용합니다.
const root = ReactDOM.createRoot(document.getElementById('root'));

// React 앱을 HTML 파일의 #root div에 렌더링
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 성능 측정을 원하면 사용 (이 부분을 삭제할 수 있습니다)
// reportWebVitals();
