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
        }catch(Exception e){
            claims = null;
        }
        return claims;
    }
    public String getUsername(String token){
        String username;
        try{
            Claim  claims = this.getClaim(token);
            username = claims.getSubject();
        }catch (Exception e){
            username = null;
        }
        return username;
    }

    public Object getRoles(String token){
        Object roles;
        try{
            Claim claims = this.getClaims(token);
            roles = claims.get("roles");
        }catch (Exception e){
            roles = null;
        }
        return roles;
    }


}
