package com.skii.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;


@Data
@Builder
public class CandidateDetailResponseDTO {
    // Thông tin ứng viên
    private Long profileId;
    private String name;
    private String email;
    private String phone;
    private String avatar;
    private String experience; // Tổng số năm kinh nghiệm
    private String note;       // Lời nhắn gửi đến trung tâm

    //Lấy từ kho dữ liệu Hashtag của trung tâm
    private List<HashtagDTO> suggestedRoles; 
    private List<HashtagDTO> suggestedTraits;
}