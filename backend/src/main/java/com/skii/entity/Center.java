package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "centers")
@Data
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; 
    @Column(unique = true)
    private String centerCode; 

    private String email; 
    private String phone; 
    private String address; 
    private String avatar;
    private String website;
    
    private LocalDate establishedDate;

    @OneToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL)
    private List<Hashtag> hashtags = new ArrayList<>();
}