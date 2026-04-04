package com.shohaib.objectbasedoutcome.service.exception.handler;

public class EmailNotFoundException extends RuntimeException
{
    public EmailNotFoundException(String message) {
        super(message);
    }
    public EmailNotFoundException(Throwable throwable)
    {
        super(throwable);
    }
}
