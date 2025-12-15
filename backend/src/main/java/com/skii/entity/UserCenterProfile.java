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

    // DỮ LIỆU ĐẶC THÙ CHO STUDENT  ---
    private LocalDate enrolledDate;
    private String currentLevel; 

    //  DỮ LIỆU ĐẶC THÙ CHO STAFF ---
    private LocalDate joinDate;
    private Double baseSalary;

    // BỔ SUNG: Rating và Experience 
    private Double rating;      
    private String experience;  
    private Integer totalClasses; 

    @Column(length = 500)
    private String note;
}