package com.trustserve;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

/** Centralized domain validation and booking rules. */
public final class Rules {
    private Rules() {}

    public static final List<String> SLOTS = List.of("09:00", "11:00", "14:00", "16:00");

    public static void future(LocalDate date, String slot) {
        if (date == null || slot == null || !SLOTS.contains(slot)) {
            throw new BookingRuleException("Choose a valid date and available time slot.");
        }
        final LocalTime time;
        try {
            time = LocalTime.parse(slot);
        } catch (RuntimeException ex) {
            throw new BookingRuleException("Choose a valid time slot.");
        }
        if (!LocalDateTime.of(date, time).isAfter(LocalDateTime.now())) {
            throw new BookingRuleException("Choose a future date and available time slot.");
        }
    }

    public static void transition(String oldStatus, String nextStatus) {
        Map<String, List<String>> allowed = Map.of(
            "Pending", List.of("Confirmed", "Professional Assigned", "Accepted", "Rejected", "Cancelled"),
            "Confirmed", List.of("Professional Assigned", "Accepted", "Cancelled"),
            "Professional Assigned", List.of("Accepted", "Rejected", "Cancelled"),
            "Accepted", List.of("In Progress", "Cancelled"),
            "In Progress", List.of("Completed")
        );
        if (oldStatus == null || nextStatus == null || !allowed.getOrDefault(oldStatus, List.of()).contains(nextStatus)) {
            throw new BookingRuleException("Invalid status transition: " + oldStatus + " to " + nextStatus);
        }
    }

    public static boolean blocking(String status) {
        return !List.of("Cancelled", "Rejected").contains(status);
    }

    public static void password(String password) {
        if (password == null || password.length() < 10 || password.length() > 72
                || !password.matches(".*[0-9].*") || !password.matches(".*[A-Za-z].*")) {
            throw new PasswordValidationException("Password must contain letters and digits and be 10–72 characters.");
        }
    }
}
