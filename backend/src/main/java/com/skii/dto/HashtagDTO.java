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
    private String id;      // "role-teacher", "trait-ielts"...
    private String name;    // "Giáo viên", "IELTS"...
    private String type;    // "ROLE", "TRAIT"
    private boolean isSystem; 
}