package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "session_tuitions")
@Data
@EqualsAndHashCode(callSuper = true)
public class SessionTuition extends Tuition {
    private Integer presentSessions; // Số buổi đi học thực tế
    private Integer absentSessions;  // Số buổi vắng
    private Integer makeupSessions;  // Số buổi học bù
    private LocalDate billingMonth;  // Tháng chốt học phí
}