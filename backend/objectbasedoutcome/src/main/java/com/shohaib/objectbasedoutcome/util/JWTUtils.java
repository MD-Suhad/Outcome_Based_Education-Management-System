package com.shohaib.objectbasedoutcome.util;


import com.auth0.jwt.interfaces.Claim;
import com.shohaib.core.util.JWT;
import lombok.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtils {
    @Value("github-secret")
    private String secret;

    private Claim getClass(String token){
        Claim claims;

        try{
            claims = JWT.parse().setSigningKey(this.secret).parseClaimsJws(token).getBody();
        }
    }


}
