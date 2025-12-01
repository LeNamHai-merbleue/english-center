package com.skii.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "admins")
@Data
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user; 

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "center_id")
    private Center center;
}