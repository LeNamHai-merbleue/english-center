package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "payrolls")
@Data
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User staff;

    private LocalDate billingMonth; // Tháng tính lương (vd: 2026-01-01)
    private Double totalAmount;     // Tổng lương thực nhận sau khi cộng/trừ
    
    @Enumerated(EnumType.STRING)
    private PayrollStatus status;   // PENDING (Chờ duyệt), PAID (Đã chi trả)

    // Danh sách chi tiết lương theo từng lớp
    @OneToMany(mappedBy = "payroll", cascade = CascadeType.ALL)
    private List<PayrollDetail> details = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private Center center;
}

enum PayrollStatus{PENDING, PAID}