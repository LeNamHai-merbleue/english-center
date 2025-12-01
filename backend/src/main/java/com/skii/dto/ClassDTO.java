package com.skii.dto;

import com.skii.entity.Class.ClassStatus;
import com.skii.entity.Class.ClassType;
import com.skii.entity.Class.ClassStyle;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassDTO {
    private Long id;
    private String name;
    private String level;
    
    // --- Phân loại & Trạng thái (Logic Backbone) ---
    private ClassType type;      // REGULAR / MAKEUP
    private ClassStyle style;    // SESSION_BASED / PHASE_BASED
    private ClassStatus status;  // PENDING / OPENING / ACTIVE / CLOSED

    // --- Cấu trúc & Định mức ---
    private Integer maxStudents;    
    private Integer totalSessions;  
    private Integer phases;         
    private Integer progress;       

    // --- Thời gian & Địa điểm (Dữ liệu thô) ---
    private String defaultRoom;    
    private String schedule;       // "T2, T4, T6"
    private String time;           // "18:00 - 20:00"
    private LocalDate date;        // Ngày cụ thể cho lớp MAKEUP
    private String note; 

    // --- NHÂN SỰ (ClassStaff) ---
    private List<ClassStaffDTO> staffs; 
    private List<UserDTO> requestedTeachers; 

    // --- HỌC SINH (ClassStudent) ---
    private List<ClassStudentDTO> students; 
    private List<UserDTO> pendingStudents;

    // --- Trường hỗ trợ tính toán ---
    private Integer currentStudentCount; 
}