package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_center_profiles")
@Data
public class UserCenterProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;

    @ManyToMany
    @JoinTable(
        name = "profile_hashtags",
        joinColumns = @JoinColumn(name = "profile_id"),
        inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
    private Set<Hashtag> hashtags = new HashSet<>();

    @Column(nullable = false)
    private String status; 

    // --- 5. DỮ LIỆU ĐẶC THÙ CHO STUDENT (Học viên) ---
    private LocalDate enrolledDate;
    private String currentLevel; // Thêm trường này để biết trình độ hiện tại của học sinh tại trung tâm

    // --- 6. DỮ LIỆU ĐẶC THÙ CHO STAFF (Nhân viên/Giáo viên) ---
    private LocalDate joinDate;
    private Double baseSalary;

    // BỔ SUNG: Rating và Experience phục vụ chức năng Phân công (Mục 4)
    private Double rating;      // Ví dụ: 4.5, 5.0 (để lọc giáo viên giỏi)
    private String experience;  // Ví dụ: "3 năm kinh nghiệm", "IELTS 8.5"
    private Integer totalClasses; // Số lớp đã từng dạy (để đo độ uy tín)

    @Column(length = 500)
    private String note;
}