package com.trustserve;

/** Raised when user input fails a domain validation rule. */
public class ValidationException extends TrustServeException {
    public ValidationException(String message) { super(message); }
}
