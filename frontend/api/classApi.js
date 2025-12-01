import axiosClient from './axiosClient';

// Lấy danh sách lớp học
export const getClassList = async (type, viewGroup) => {
    const params = { 
        type: type.toUpperCase(), 
        viewGroup: viewGroup.toUpperCase() 
    };
    return await axiosClient.get('/admin/classes/list', { params });
};

// Tạo lớp học theo BUỔI
export const createRegularSessionsClass = async (classData) => {
    return await axiosClient.post('/admin/classes/create/regular-sessions', classData);
};

// Tạo lớp học theo LỘ TRÌNH (Hàm bạn bị thiếu)
export const createRegularPhasesClass = async (classData) => {
    return await axiosClient.post('/admin/classes/create/regular-phases', classData);
};

// Tạo lớp học BÙ
export const createMakeupClass = async (classData) => {
    return await axiosClient.post('/admin/classes/create/makeup', classData);
};

// Phân công nhân sự
export const assignStaffToClass = async (classId, teacherId, assistantIds) => {
    return await axiosClient.post(`/admin/classes/${classId}/assign-staff`, null, {
        params: {
            teacherId,
            assistantIds: assistantIds.join(',')
        }
    });
};

// Kích hoạt mở lớp
export const activateClass = async (classId) => {
    return await axiosClient.post(`/admin/classes/${classId}/activate`);
};

// Chi tiết lớp học
export const getClassDetail = async (classId) => {
    return await axiosClient.get(`/admin/classes/${classId}`);
};