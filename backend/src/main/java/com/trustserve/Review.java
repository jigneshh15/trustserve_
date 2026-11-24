package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_review") public class Review {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @OneToOne public Booking booking; public int rating; @Column(length=2000) public String comment; public boolean visible=true; public String moderationReason; }