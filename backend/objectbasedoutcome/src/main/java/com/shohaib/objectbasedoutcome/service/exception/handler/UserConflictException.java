package com.shohaib.objectbasedoutcome.service.exception.handler;

public class UserConflictException extends Exception
{
    public UserConflictException(String message){ super(message); }
    public UserConflictException(Throwable throwable){ super(throwable); } 
    
}
