package com.shohaib.core.exception.handler;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import com.shohaib.core.api.response.Response;

import java.util.ArrayList;

public class MethodArgumentNotValidExceptionHandler
{

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Response<Object> handle(MethodArgumentNotValidException e)
    {
        return Response.validationException().setErrors(this.getMessages(e));
    }

    private ArrayList<String> getMessages(MethodArgumentNotValidException e)
    {
        ArrayList<String> messages = new ArrayList<>();
        e.getBindingResult().getFieldErrors().forEach(error -> {
            messages.add(error.getDefaultMessage());
        });
        return messages;
    }
}
