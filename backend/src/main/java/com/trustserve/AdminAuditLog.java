package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_adminauditlog") public class AdminAuditLog {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); public Long actor; public String action; }