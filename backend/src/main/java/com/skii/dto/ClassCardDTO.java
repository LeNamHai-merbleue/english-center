package com.skii.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClassCardDTO {
    private Long id;
    private String name;          
    private String level;        
    private Integer progress;     
    private String teacherName;   
    private Integer currentStudents; 
    private Integer maxStudents;     
    private String schedule;      
    private String time;         
    private String room;          
}