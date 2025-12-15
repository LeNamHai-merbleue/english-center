package com.skii.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long userId;
    private String name;           
    private String email;          
    private String activeRole;  
    
    // --- Thông tin JWT Token ---
    private String accessToken;   

    // --- Thông tin Trung tâm đang làm việc ---
    private Long workingCenterId;
    private String centerName;    
}