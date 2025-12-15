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
    private Long id;
    
    // --- Thông tin Nhân sự  ---
    private Long staffId;       
    private String staffName;   
    private String staffEmail;   
    private String staffPhone;  
    
    // --- Thông tin trong lớp học ---
    private StaffClassRole role;        
    private AssignmentStatus status;    // ACTIVE, PENDING_CONFIRM, TERMINATED
    private LocalDate assignedDate;    
    private Double hourlyRate;          // Lương/giờ thỏa thuận cho lớp này

    // --- Thông tin Lớp ---
    private Long classId;
    private String className;
}