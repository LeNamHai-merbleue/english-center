package com.skii.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String avatar;
    private boolean isAdmin;
    private String centerCode;  // Mã trung tâm để FE lưu vào LocalStorage
    private Long centerId;      // ID trung tâm
    private String centerName;
    private String token;       // Chuỗi JWT
}