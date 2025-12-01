/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",           // File HTML chính (nếu dùng plain HTML)
    "./component/**/*.{js,ts,jsx,tsx}",  
  ],
  theme: {
    extend: {},  // Thêm tùy chỉnh theme nếu cần (ví dụ: màu sắc mới)
  },
  plugins: [],   // Thêm plugin nếu cần (như @tailwindcss/forms)
}