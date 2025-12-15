package com.skii.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HashtagDTO {
    private String id;     
    private String name;  
    private String type;   
    private boolean isSystem; 
}