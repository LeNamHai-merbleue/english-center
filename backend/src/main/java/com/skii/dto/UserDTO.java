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
    // Thông tin cơ bản (Từ bảng users)
    private Long id;
    private String name;
    private String avatar;
    private String email; // Bổ sung để liên lạc
    private String phone; // Bổ sung để liên lạc
    private String role;  // Nên lưu dạng: "MAIN_TEACHER", "ASSISTANT", "STUDENT"

    // Thông tin chuyên môn (Từ bảng user_center_profiles)
    private Double rating;      
    private String experience;  
    private String currentLevel; 
    private List<String> hashtags; 
    private String status;       // "ACTIVE", "PENDING", "INACTIVE"
}