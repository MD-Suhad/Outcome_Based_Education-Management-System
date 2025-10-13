package com.shohaib.core.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.Sanitizer;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;

@Component
public class BaseController
{

    @Autowired
    private Sanitizer sanitizer;


    protected String sanitize(String unsafeString)
    {
        return (String) sanitizer.sanitize(unsafeString);
    }

    protected ArrayList<String> errors(String... message)
    {
        return new ArrayList<>(Arrays.asList(message));
    }
}
