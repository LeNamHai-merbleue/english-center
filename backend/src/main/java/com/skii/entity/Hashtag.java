package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor; // Thêm cái này
import lombok.Builder;

@Builder
@Entity
@NoArgsConstructor  // Để Hibernate tạo được Object
@AllArgsConstructor // BẮT BUỘC: Để @Builder hoạt động
@Table(name = "hashtags")
@Data
public class Hashtag {
    
    @Id
    private String id; 

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; 

    private String color; 

    @Column(name = "is_system", nullable = false)
    private boolean isSystem = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;
}