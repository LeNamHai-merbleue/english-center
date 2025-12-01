package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "roadmap_tuitions")
@Data

@EqualsAndHashCode(callSuper = true)
public class RoadmapTuition extends Tuition {
    private Integer installmentNumber; // Đợt thứ mấy (ví dụ: 1, 2, 3)
    private Integer totalInstallments;  // Tổng số đợt (ví dụ: 3)
    private String roadmapPhase;        // Tên giai đoạn (ví dụ: "Giai đoạn khởi động")
}