package com.skii.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentResponseDTO {
    private Long profileId;    
    private Long userId;      
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private LocalDate birthday;
    
    // Dữ liệu từ UserCenterProfile
    private String status;      // ACTIVE, INACTIVE, PENDING
    private LocalDate joinDate;
    private String experience;  
    private Integer totalClasses;
    private String currentLevel; 
    private String note;
    
    private GroupedHashtagResponseDTO hashtag;
}