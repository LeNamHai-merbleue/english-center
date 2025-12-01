package com.skii.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ClassListResponse {
    // Danh sách các Card lớp học để hiển thị lên UI
    private List<ClassCardDTO> classes;

    // Con số tổng cộng dành riêng cho bộ lọc hiện tại
    private long totalItems; 
    
    // Bạn có thể trả về thêm tên bộ lọc để Frontend dễ hiển thị tiêu đề
    private String currentFilter; 
}