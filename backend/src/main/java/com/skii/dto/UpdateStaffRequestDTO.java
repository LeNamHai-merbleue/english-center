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
public class UpdateStaffRequestDTO {
    
    // Danh sách ID hashtag mới để ghi đè vào bảng trung gian
    private List<String> hashtagIds; 

    // Lương cơ bản tại trung tâm
    private Double baseSalary;

    private Double rating;

    // Ghi chú của quản lý về nhân sự này
    private String note;

    // Trạng thái làm việc: ACTIVE, INACTIVE
    private String status;
}