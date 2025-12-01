package com.skii.dto;

import com.skii.entity.ClassStudent.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassStudentDTO {
    private Long id; // ID của bản ghi trung gian

    // --- Thông tin Học sinh (Lấy từ User) ---
    private Long studentId;      // user_id
    private String studentName;   // Tên học sinh
    private String studentEmail;
    private String studentPhone;

    // --- Trạng thái học tập ---
    private EnrollmentStatus status; // ACTIVE, DROPPED, RESERVED
    private LocalDate enrollmentDate;

    // --- Kết quả học tập ---
    private Double midtermScore;
    private Double finalScore;
    private String teacherRemark;

    // --- Thông tin lớp (Nếu cần dùng cho Profile học sinh) ---
    private Long classId;
    private String className;
}