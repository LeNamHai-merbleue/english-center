import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// 1. Đăng ký Admin & Trung tâm
export const registerAdmin = async (registerData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/register`, registerData);
        return response.data; // Trả về thông báo thành công
    } catch (error) {
        throw error.response ? error.response.data : new Error("Lỗi kết nối server");
    }
};

// 2. Đăng nhập Admin
export const loginAdmin = async (loginData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/login`, loginData);
        
        // Nếu đăng nhập thành công và có accessToken
        if (response.data.accessToken) {
            // Lưu token vào localStorage để dùng cho các API sau
            localStorage.setItem('admin_token', response.data.accessToken);
            // Lưu thêm thông tin centerId và tên admin nếu cần hiển thị UI
            localStorage.setItem('center_id', response.data.workingCenterId);
            localStorage.setItem('admin_name', response.data.name);
        }
        
        return response.data; // Trả về thông tin LoginResponse (DTO)
    } catch (error) {
        throw error.response ? error.response.data : new Error("Sai email hoặc mật khẩu");
    }
};

// 3. Đăng xuất
export const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('center_id');
    localStorage.removeItem('admin_name');
    window.location.href = '/login'; // Chuyển hướng về trang login
};