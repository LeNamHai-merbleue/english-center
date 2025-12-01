package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "payroll_details")
@Data
public class PayrollDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payroll_id")
    private Payroll payroll;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class classs;

    private Integer totalSessionsInMonth; // Tổng số buổi lớp đã diễn ra trong tháng
    private Integer presentSessions;      // Số buổi nhân sự có mặt dạy (Điểm danh PRESENT)
    private Integer absentSessions;       // Số buổi nhân sự vắng (Điểm danh ABSENT)
    
    private Double ratePerSession;        // Mức lương mỗi buổi (lấy từ ClassStaff)
    private Double subTotal;              // Thành tiền của lớp này = presentSessions * ratePerSession
}