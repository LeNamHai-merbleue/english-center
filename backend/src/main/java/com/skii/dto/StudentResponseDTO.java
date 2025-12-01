package com.skii.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentResponseDTO {
    private Long profileId;    // ID của UserCenterProfile
    private Long userId;       // ID của User gốc
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate birthday;
    
    // Dữ liệu từ UserCenterProfile
    private String status;      // ACTIVE, INACTIVE, PENDING
    private LocalDate joinDate;
    private String experience;  // Với Student có thể hiểu là "Học vấn/Trình độ cũ"
    private Integer totalClasses; // Số lớp đang theo học
    private String currentLevel; // Trình độ hiện tại (ví dụ: Pre-IELTS, Level A1...)
    private String note;
    
    private GroupedHashtagResponseDTO hashtag; // Chứa #STUDENT_X, #CLASS_A...
}