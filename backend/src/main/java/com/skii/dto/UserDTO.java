package com.skii.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    // Thông tin cơ bản 
    private Long id;
    private String name;
    private String avatar;
    private String email; 
    private String phone; 
    private String role;  
    // Thông tin chuyên môn 
    private Double rating;      
    private String experience;  
    private String currentLevel; 
    private List<String> hashtags; 
    private String status;       // "ACTIVE", "PENDING", "INACTIVE"
}