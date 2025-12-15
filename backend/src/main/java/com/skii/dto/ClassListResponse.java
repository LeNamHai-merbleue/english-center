package com.skii.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ClassListResponse {
    // Danh sách các Card lớp học
    private List<ClassCardDTO> classes;

    private long totalItems; 
    
    private String currentFilter; 
}