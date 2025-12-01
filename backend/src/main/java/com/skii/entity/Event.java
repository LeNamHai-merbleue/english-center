package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Data
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; 
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private LocalDate date;

    // Tách thời gian để dễ dàng sắp xếp và hiển thị trên TimeSlot
    @Column(nullable = false)
    private LocalTime startTime; // '09:00'
    
    @Column(nullable = false)
    private LocalTime endTime;   // '11:00'

    private String location;
    
    private String participants; 
    
    @Column(name = "class_name")
    private String classs; 

    @Column(columnDefinition = "TEXT")
    private String description;

    private String color; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private Center center;
}