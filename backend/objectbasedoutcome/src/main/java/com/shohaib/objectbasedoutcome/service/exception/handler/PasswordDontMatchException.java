package com.shohaib.objectbasedoutcome.service.exception.handler;

public class PasswordDontMatchException extends RuntimeException {
    public PasswordDontMatchException(String message) {
        super(message);
    }
}
