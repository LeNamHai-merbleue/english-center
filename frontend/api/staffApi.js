// 1. Import cái axiosClient "xịn" đã có cấu hình Token
import axiosClient from './axiosClient'; 

// 2. Không cần tạo const apiClient = axios.create nữa!
// 3. Chỉ cần định nghĩa các hàm gọi API dựa trên axiosClient

// Lấy danh sách nhân viên
export const getStaffList = async (params) => {
    // Vì axiosClient đã có baseURL là '.../api' 
    // nên ở đây ta chỉ cần viết tiếp phần còn lại của URL
    return await axiosClient.get('/admin/staffs/list', { params });
};

// Lấy chi tiết một nhân viên
export const getStaffDetail = async (profileId) => {
    return await axiosClient.get(`/admin/staffs/${profileId}/detail`);
};

// Lấy danh sách ứng viên
export const getCandidateList = async () => {
    return await axiosClient.get('/admin/staffs/candidates');
};

// Phê duyệt ứng viên
export const approveCandidate = async (requestId, hashtagIds) => {
    return await axiosClient.post(`/admin/staffs/candidates/${requestId}/approve`, hashtagIds);
};

// Từ chối ứng viên
export const rejectCandidate = async (requestId) => {
    return await axiosClient.delete(`/admin/staffs/candidates/${requestId}/reject`);
};

// Cập nhật nhân viên
export const updateStaff = async (profileId, data) => {
    return await axiosClient.patch(`/admin/staffs/${profileId}/update`, data);
};

// Xóa nhân viên
export const deleteStaff = async (profileId) => {
    return await axiosClient.delete(`/admin/staffs/${profileId}`);
};

export const getCandidateDetail = async (requestId) => {
    // Endpoint này phải khớp với Controller ở Backend của bạn
    return await axiosClient.get(`/admin/staffs/candidates/${requestId}`);
};