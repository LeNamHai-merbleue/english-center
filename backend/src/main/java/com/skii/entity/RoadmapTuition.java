package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "roadmap_tuitions")
@Data

@EqualsAndHashCode(callSuper = true)
public class RoadmapTuition extends Tuition {
    private Integer installmentNumber; // Đợt thứ mấy 
    private Integer totalInstallments;  // Tổng số đợt 
    private String roadmapPhase;        // Tên giai đoạn 
}