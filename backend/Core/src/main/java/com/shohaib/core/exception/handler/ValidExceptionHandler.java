package com.shohaib.core.exception.handler;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.shohaib.core.api.response.Response;

import java.util.ArrayList;

/*
    When @Valid throws an exception, this handler gets called, gets all the error messages and puts them together
 */
public class ValidExceptionHandler
{
    @ExceptionHandler(ConstraintViolationException.class)
    public Response<Object> handle(ConstraintViolationException e)
    {
        return Response.validationException().setErrors(this.getMessages(e.getMessage()));
    }

    private ArrayList<String> getMessages(String exceptionMessage)
    {
        ArrayList<String> messages = new ArrayList<>();
        for(String str: exceptionMessage.split(","))
        {
            messages.add(str.split(":")[1].trim() + ".");
        }
        return messages;
    }
}
