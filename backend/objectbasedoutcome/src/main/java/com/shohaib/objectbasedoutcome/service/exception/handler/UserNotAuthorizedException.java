package com.shohaib.objectbasedoutcome.service.exception.handler;

public class UserNotAuthorizedException extends Exception
{
    public UserNotAuthorizedException(String message){ super(message); }
    public UserNotAuthorizedException(Throwable throwable){ super(throwable); } 
    
}
