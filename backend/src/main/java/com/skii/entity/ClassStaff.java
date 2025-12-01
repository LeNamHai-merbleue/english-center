package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "class_staffs")
@Data
public class ClassStaff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class classs;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User staff;

    @Enumerated(EnumType.STRING)
    private StaffClassRole role; // MAIN_TEACHER (GV chính), ASSISTANT (Trợ giảng)

    private LocalDate assignedDate; // Ngày bắt đầu nhận lớp
    
    @Enumerated(EnumType.STRING)
    private AssignmentStatus status; // ACTIVE (Đang dạy), TERMINATED (Đã nghỉ dạy lớp này)

    private Double hourlyRate; // Lương thỏa thuận riêng cho lớp này

    public enum StaffClassRole { MAIN_TEACHER, ASSISTANT }
    public enum AssignmentStatus { ACTIVE,PENDING_CONFIRM, TERMINATED }
}
