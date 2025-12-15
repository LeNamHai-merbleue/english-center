package com.skii.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; 

    @Enumerated(EnumType.STRING)
    private ClassType type; // REGULAR, MAKEUP

    @Enumerated(EnumType.STRING)
    private ClassStyle style; // SESSION_BASED, PHASE_BASED

    @Enumerated(EnumType.STRING)
    private ClassStatus status; // PENDING, OPENING, ACTIVE, CLOSED

    private String level; 
    private String defaultRoom; 
    private Integer maxStudents; 
    private Integer totalSessions; 
    
    // --- Bổ sung trường phục vụ UI Card và Lớp lộ trình ---
    private Integer phases;   // Số giai đoạn (Dùng cho PHASE_BASED)
    private Integer progress; // % Tiến độ hoàn thành (Ví dụ: 75)
    
    private String note; 
    private LocalDate date; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Center center;

    /**
     * LUỒNG 1: NHÂN SỰ ĐANG GIẢNG DẠY
     */
    @OneToMany(mappedBy = "classs", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassStaff> classStaffs = new ArrayList<>();

    /**
     * LUỒNG 2: GIÁO VIÊN ỨNG TUYỂN (DÀNH CHO ADMIN DUYỆT)
     */
    @ManyToMany
@JoinTable(
    name = "staff_applications", // Khớp với tên bảng SQL của bạn
    joinColumns = @JoinColumn(name = "class_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
)
@Builder.Default
private List<User> applicantTeachers = new ArrayList<>();

/**
 * LUỒNG 3: HỌC SINH XIN VÀO LỚP
 */
@ManyToMany
@JoinTable(
    name = "student_enrollment_requests",
    joinColumns = @JoinColumn(name = "class_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id")
)
@Builder.Default
private List<User> pendingStudents = new ArrayList<>();

    /**
     * QUẢN LÝ LỊCH HỌC CỐ ĐỊNH
     */
    @OneToMany(mappedBy = "classs", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ClassSchedule> schedules = new ArrayList<>();

    /**
     * QUẢN LÝ HỌC SINH CHÍNH THỨC
     */
    @OneToMany(mappedBy = "classs", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ClassStudent> classStudents = new ArrayList<>();

    /**
     * QUẢN LÝ CÁC BUỔI HỌC CỤ THỂ
     */
    @OneToMany(mappedBy = "classs", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ClassSession> sessions = new ArrayList<>();

    // --- ENUMS (Viết hoa toàn bộ để chuẩn Java Convention) ---
    public enum ClassType { REGULAR, MAKEUP }
    public enum ClassStyle { SESSION_BASED, PHASE_BASED }
    public enum ClassStatus { PENDING, OPENING, ACTIVE, CLOSED }
}