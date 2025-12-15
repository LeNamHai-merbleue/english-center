package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String avatar;

    private LocalDate birthday;

    @Builder.Default
    private boolean isAdmin = false;

    /**
     * THÔNG TIN HỒ SƠ TẠI CÁC TRUNG TÂM
     * Một user có thể là Staff/Teacher tại nhiều chi nhánh khác nhau.
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserCenterProfile> profiles = new ArrayList<>();

    /**
     * LUỒNG 1: XIN GIẢNG DẠY (Dành cho Staff)
     * Lưu danh sách các lớp mà User này đã nhấn nút "Ứng tuyển" (Apply to teach).
     * Admin sẽ duyệt danh sách này để đưa vào ClassStaff chính thức.
     */
    @ManyToMany
    @JoinTable(
        name = "staff_applications", // Bảng trung gian lưu đơn xin dạy
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    @Builder.Default
    private List<Class> appliedToTeach = new ArrayList<>();

    /**
     * LUỒNG 2: XIN VÀO HỌC (Dành cho Học sinh - Mở rộng sau này)
     * Lưu danh sách các lớp mà User này đăng ký xin vào học.
     * Giáo viên chính của lớp sẽ duyệt danh sách này.
     */
    @ManyToMany
    @JoinTable(
        name = "student_enrollment_requests", // Bảng trung gian lưu đơn xin học
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "class_id")
    )
    @Builder.Default
    private List<Class> appliedToLearn = new ArrayList<>();

    /**
     * DANH SÁCH LỚP ĐANG DẠY CHÍNH THỨC
     * Quan hệ thông qua bảng trung gian có chứa thông tin bổ sung (Lương, vai trò).
     */
    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ClassStaff> activeTeachingAssignments = new ArrayList<>();

    // Helper methods để thêm/xóa ứng tuyển nhanh
    public void applyForClass(Class classs) {
        this.appliedToTeach.add(classs);
    }

    public void cancelApplication(Class classs) {
        this.appliedToTeach.remove(classs);
    }
}