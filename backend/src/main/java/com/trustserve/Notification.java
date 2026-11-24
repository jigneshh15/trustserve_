package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_notification") public class Notification {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @ManyToOne public Account recipient; public String message; public boolean seen=false; }