package com.skii.dto;

import lombok.Data;

@Data
public class AdminRegisterDTO {

    private String name; 
    private String email; 

    private String password;

    private String phone;

    private String centerName;

    private String centerEmail; // Email riêng của trung tâm (có thể trùng email admin)

    private String centerAddress;
    
    private String centerPhone;  // Hotline riêng của trung tâm
}