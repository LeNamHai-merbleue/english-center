package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private User author; // Nối với bảng User để lấy name, avatar

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Center center; // Bài viết thuộc trung tâm nào

    @Column(columnDefinition = "TEXT")
    private String content;

    private String image; // URL ảnh chính của bài viết
    private String color; // Màu sắc chủ đạo (nếu có)
    private LocalDateTime createdAt;

    // Các trường thống kê
    private int likes = 0;
    private int shares = 0;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<Comment> commentsList = new ArrayList<>();
}