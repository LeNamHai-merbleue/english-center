// 1. Import axiosClient đã cấu hình sẵn Token và baseURL
import axiosClient from './axiosClient'; 

/**
 * 1. LẤY DANH SÁCH HỌC VIÊN CHÍNH THỨC
 * @param params { search?: string, hashtagIds?: string[] }
 */
export const getStudentList = async (params) => {
    // Gọi đến @GetMapping("/list") trong StudentController
    return await axiosClient.get('/admin/students/list', { params });
};

/**
 * 2. LẤY DANH SÁCH ĐƠN ĐĂNG KÝ HỌC (Candidates)
 * Trả về danh sách JoinRequest có type = STUDENT_REQUEST
 */
export const getStudentCandidateList = async () => {
    // Gọi đến @GetMapping("/candidates")
    return await axiosClient.get('/admin/students/candidates');
};

/**
 * 3. LẤY CHI TIẾT ĐƠN ĐĂNG KÝ
 * Dùng để xem thông tin trước khi duyệt
 */
export const getStudentCandidateDetail = async (requestId) => {
    // Gọi đến @GetMapping("/candidates/{requestId}")
    return await axiosClient.get(`/admin/students/candidates/${requestId}`);
};

/**
 * 4. PHÊ DUYỆT HỌC VIÊN MỚI
 * @param requestId ID của JoinRequest
 * @param hashtagIds Danh sách ID nhãn (Bắt buộc phải có nhãn STUDENT_X)
 */
export const approveStudent = async (requestId, hashtagIds) => {
    // Gọi đến @PostMapping("/candidates/{requestId}/approve")
    return await axiosClient.post(`/admin/students/candidates/${requestId}/approve`, hashtagIds);
};

/**
 * 5. TỪ CHỐI ĐƠN ĐĂNG KÝ
 */
export const rejectStudentCandidate = async (requestId) => {
    // Gọi đến @DeleteMapping("/candidates/{requestId}/reject")
    return await axiosClient.delete(`/admin/students/candidates/${requestId}/reject`);
};

/**
 * 6. LẤY CHI TIẾT HỒ SƠ HỌC VIÊN
 */
export const getStudentDetail = async (profileId) => {
    // Gọi đến @GetMapping("/{profileId}/detail")
    return await axiosClient.get(`/admin/students/${profileId}/detail`);
};

/**
 * 7. CẬP NHẬT THÔNG TIN HỌC VIÊN
 * @param data UpdateStudentRequestDTO { hashtagIds, note, status }
 */
export const updateStudent = async (profileId, data) => {
    // Gọi đến @PatchMapping("/{profileId}/update")
    return await axiosClient.patch(`/admin/students/${profileId}/update`, data);
};

/**
 * 8. XÓA HỒ SƠ HỌC VIÊN (Học viên nghỉ học)
 */
export const deleteStudent = async (profileId) => {
    // Gọi đến @DeleteMapping("/{profileId}")
    return await axiosClient.delete(`/admin/students/${profileId}`);
};