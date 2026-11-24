package com.trustserve;

/** Raised when a password does not meet TrustServe's password policy. */
public class PasswordValidationException extends ValidationException {
    public PasswordValidationException(String message) { super(message); }
}
