package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "class_sessions")
@Data
public class ClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class classs; // Nối đến lớp để lấy thông tin: Tên lớp, giáo viên, học sinh

    private LocalDate date; // Ngày học (Ví dụ: 2024-05-20)
    private LocalTime startTime; // Giờ bắt đầu
    private LocalTime endTime;   // Giờ kết thúc
    
    private String room;

    @Enumerated(EnumType.STRING)
    private SessionStatus status;
    
    public enum SessionStatus{UPCOMING , ONGOING , COMPLETED };

    // Quan hệ để lấy dữ liệu điểm danh
    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<Attendance> attendanceList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Center center;
}