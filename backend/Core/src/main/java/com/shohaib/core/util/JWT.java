package com.shohaib.core.util;

import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JWT
{
    private String content;


    public String getUsername()
    {
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(this.content);
        return jwt.getSubject();
    }

    public String getPassowrdUsername()
    {
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(this.content);
        return jwt.getSubject();
    }

}
