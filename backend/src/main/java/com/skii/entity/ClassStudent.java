package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "class_students")
@Data
public class ClassStudent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Kết nối tới lớp học
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classs;

    // Kết nối tới User (Học sinh)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User student;

    // Thông tin bổ sung cho học sinh trong lớp này
    private LocalDate enrollmentDate; // Ngày bắt đầu vào lớp
    
    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status; // ACTIVE, DROPPED, RESERVED (Bảo lưu)

    private Double midtermScore; // Điểm giữa kỳ (ví dụ)
    private Double finalScore;   // Điểm cuối kỳ
    
    @Column(columnDefinition = "TEXT")
    private String teacherRemark; // Nhận xét của giáo viên cho riêng học sinh này

    public enum EnrollmentStatus { ACTIVE, DROPPED, RESERVED }
}
