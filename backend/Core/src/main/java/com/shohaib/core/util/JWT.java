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
        String token = this.content;
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7).trim();
        }
        DecodedJWT jwt = com.auth0.jwt.JWT.decode(token);
        return jwt.getSubject();
    }

}
