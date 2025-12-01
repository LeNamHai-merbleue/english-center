package com.skii.dto;

import com.skii.entity.ClassStaff.StaffClassRole;
import com.skii.entity.ClassStaff.AssignmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassStaffDTO {
    private Long id; // ID của bản ghi trung gian này
    
    // --- Thông tin Nhân sự (Lấy từ User) ---
    private Long staffId;       // user_id
    private String staffName;    // Tên đầy đủ của GV/Trợ giảng
    private String staffEmail;   // Email để liên lạc
    private String staffPhone;   // Số điện thoại
    
    // --- Thông tin trong lớp học ---
    private StaffClassRole role;        // MAIN_TEACHER hoặc ASSISTANT
    private AssignmentStatus status;    // ACTIVE, PENDING_CONFIRM, TERMINATED
    private LocalDate assignedDate;     // Ngày nhận lớp
    private Double hourlyRate;          // Lương/giờ thỏa thuận cho lớp này

    // --- Thông tin Lớp (Nếu cần trả về trong danh sách công việc của Staff) ---
    private Long classId;
    private String className;
}