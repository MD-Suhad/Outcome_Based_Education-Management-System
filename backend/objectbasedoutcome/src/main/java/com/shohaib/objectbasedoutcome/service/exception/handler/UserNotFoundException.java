package com.shohaib.objectbasedoutcome.service.exception.handler;

public class UserNotFoundException extends Exception
{
    public UserNotFoundException(String message){ super(message); }
    public UserNotFoundException(Throwable throwable){ super(throwable); }

}
