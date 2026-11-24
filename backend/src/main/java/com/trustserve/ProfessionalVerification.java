package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_professionalverification") public class ProfessionalVerification {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @ManyToOne public ProfessionalProfile professional; public String status,reason; }