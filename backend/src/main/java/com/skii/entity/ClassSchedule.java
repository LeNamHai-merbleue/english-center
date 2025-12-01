package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;

@Entity
@Table(name = "class_schedules")
@Data
public class ClassSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Lịch này thuộc về lớp nào
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private Class classs;

    @Enumerated(EnumType.STRING)
    private Week dayOfWeek; // MONDAY, TUESDAY, WEDNESDAY...

    public enum Week {
        MONDAY("Thứ 2"), 
        TUESDAY("Thứ 3"), 
        WEDNESDAY("Thứ 4"), 
        THURSDAY("Thứ 5"), 
        FRIDAY("Thứ 6"), 
        SATURDAY("Thứ 7"), 
        SUNDAY("Chủ nhật");

        private final String label;
        Week(String label) { this.label = label; }
        public String getLabel() { return label; }
    }

    private LocalTime startTime; // 08:00
    private LocalTime endTime;   // 10:00
}