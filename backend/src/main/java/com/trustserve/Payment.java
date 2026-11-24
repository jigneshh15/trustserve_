package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_payment") public class Payment {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @OneToOne public Booking booking; public String method,status,reference,refundStatus="Not applicable"; public int amount; }