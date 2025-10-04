package com.shohaib.core.exception;

public class NotAuthorizedException extends Exception
{
    public NotAuthorizedException(String message){ super(message); }
    public NotAuthorizedException(Throwable throwable){ super(throwable); }

}
