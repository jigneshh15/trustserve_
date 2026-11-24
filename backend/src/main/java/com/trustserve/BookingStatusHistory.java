package com.trustserve;
import jakarta.persistence.*;
@Entity @Table(name="ts_bookingstatushistory") public class BookingStatusHistory {@Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id; public java.time.Instant createdAt=java.time.Instant.now(); @ManyToOne public Booking booking; public String status; public Long actor; }