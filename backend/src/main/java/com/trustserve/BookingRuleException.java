package com.trustserve;

/** Raised when a booking date, slot, or status transition violates a booking rule. */
public class BookingRuleException extends TrustServeException {
    public BookingRuleException(String message) { super(message); }
}
