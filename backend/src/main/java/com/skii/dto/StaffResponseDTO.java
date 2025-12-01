package com.skii.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StaffResponseDTO {
    private Long profileId; // ID của UserCenterProfile
    private Long userId;    // ID của User gốc
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate birthday;
    
    // Dữ liệu từ UserCenterProfile
    private String status;      // ACTIVE, INACTIVE, PENDING
    private LocalDate joinDate;
    private String experience;
    private Double rating;
    private Integer totalClasses;
    private String currentLevel;
    private String note;
    
    private GroupedHashtagResponseDTO hashtag;
}