// File: postcss.config.js

module.exports = {
  plugins: {
    // THAY THẾ 'tailwindcss' bằng tên gói plugin mới
    '@tailwindcss/postcss': {}, 
    // Giữ Autoprefixer (đảm bảo nó đã được cài đặt)
    'autoprefixer': {}, 
  },
};