package com.trustserve;

/** Base exception for expected TrustServe domain errors. */
public class TrustServeException extends IllegalArgumentException {
    public TrustServeException(String message) { super(message); }
}
