import axios from 'axios';

// 1. Khởi tạo instance với cấu hình cơ bản
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080/api', // URL của Backend Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Ngắt kết nối nếu server không phản hồi sau 10 giây
});

// 2. INTERCEPTOR CHO REQUEST: Tự động đính kèm Token trước khi gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage mà authApi đã lưu khi Login thành công
    const token = localStorage.getItem('admin_token');
    
    if (token) {
      // Đính kèm vào Header Authorization theo chuẩn Bearer
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. INTERCEPTOR CHO RESPONSE: Xử lý dữ liệu trả về và lỗi tập trung
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu có dữ liệu trả về, chúng ta chỉ lấy phần data bên trong
    return response.data;
  },
  (error) => {
    // XỬ LÝ LỖI TOÀN CỤC
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Lỗi hệ thống";

      switch (status) {
        case 401: // Lỗi chưa đăng nhập hoặc Token hết hạn
          console.error("Phiên làm việc hết hạn!");
          // Gửi một sự kiện để App.tsx thực hiện Logout
          window.dispatchEvent(new CustomEvent('force-logout'));
          break;
          
        case 403: // Lỗi không có quyền truy cập (Admin truy cập vào chỗ User...)
          console.error("Bạn không có quyền thực hiện hành động này!");
          break;

        case 500: // Lỗi sập Server
          console.error("Server đang gặp sự cố, vui lòng thử lại sau.");
          break;

        default:
          console.error(`Lỗi ${status}: ${message}`);
      }
      
      // Trả về message lỗi để UI có thể hiển thị (trong catch block)
      return Promise.reject(message);
    }

    // Lỗi không kết nối được tới Server (Network Error)
    if (error.request) {
      return Promise.reject("Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.");
    }

    return Promise.reject(error.message);
  }
);

export default axiosClient;