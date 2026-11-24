package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_servicecategory") public class ServiceCategory {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @Column(unique=true) public String name; }