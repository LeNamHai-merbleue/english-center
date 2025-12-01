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
    private String name;           // Tên Admin (ví dụ: Nguyễn Văn Hải)
    private String email;          // Email login của Admin
    private String activeRole;     // ADMIN hoặc USER
    
    // --- Thông tin JWT Token ---
    private String accessToken;   

    // --- Thông tin Trung tâm đang làm việc ---
    private Long workingCenterId;
    private String centerName;     // Tên trung tâm để hiển thị lên Header/UI
}