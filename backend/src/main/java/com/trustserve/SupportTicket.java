package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_supportticket") public class SupportTicket {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @ManyToOne public Account customer; public String subject; @Column(length=3000) public String message,response=""; public String status="Open"; }