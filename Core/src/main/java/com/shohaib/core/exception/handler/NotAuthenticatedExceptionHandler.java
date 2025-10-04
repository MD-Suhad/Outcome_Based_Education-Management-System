package com.shohaib.core.exception.handler;


import com.shohaib.core.exception.NotAuthorizedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.shohaib.core.api.response.Response;


public class NotAuthenticatedExceptionHandler
{

    @ExceptionHandler(NotAuthorizedException.class)
    public Response<Object> handleNotAuthorizedException(NotAuthorizedException e)
    {
        return Response.unauthorized().setErrors(e.getMessage());
    }

}



