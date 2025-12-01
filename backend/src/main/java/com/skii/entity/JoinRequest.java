package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "join_requests")
@Data
public class JoinRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // Lấy được name, email, phone, avatar, currentLevel từ đây

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Center center;

    @Enumerated(EnumType.STRING)
    private RequestType type; // STUDENT_REQUEST hoặc STAFF_REQUEST

    private LocalDate requestDate;

    @Column(columnDefinition = "TEXT")
    private String message; // Lời nhắn gửi đến trung tâm

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // PENDING, APPROVED, REJECTED

    public enum RequestStatus {PENDING, APPROVED, REJECTED}
    public enum RequestType {STUDENT_REQUEST,STAFF_REQUEST}
}
