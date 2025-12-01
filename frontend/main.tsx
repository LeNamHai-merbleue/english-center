import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx'; 
import './styles/globals.css';

// Kiểm tra và render React Root
const rootElement = document.getElementById('root');

if (rootElement) {
  // Khởi tạo root
  const root = createRoot(rootElement);
  
  // Render component gốc
  root.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );
} else {
  console.error("Lỗi: Không tìm thấy thẻ 'div id=\"root\"' trong index.html.");
}