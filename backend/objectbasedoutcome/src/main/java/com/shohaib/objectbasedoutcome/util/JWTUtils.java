package com.shohaib.objectbasedoutcome.util;


import com.auth0.jwt.interfaces.Claim;
import com.shohaib.core.util.JWT;
import lombok.Value;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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

    public Date getExpirationDate(String token){
        Date expiration;
        try{
            final Claim claims = this.getClaim(token);
            expiration = claims.getExpiration();
        }catch(Exception e){
            expiration = null;
        }
        return expiration;
    }
    public boolean validateToken(String token, UserDetails userDetails){
        final String username = getUsername(token);
        return(username.equals(userDetails.getUsername()) && !isExpire(token));
    }
    public ArrayList<String> extractRoles(UserDetails userDetails){
        ArrayList<String> roles = new ArrayList<>();
        for(GrantedAuthority ga: userDetails.getAuthorities()){
            roles.add(ga.getAuthority());
        }
        return roles;
    }
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("sub", userDetails.getUsername());
        claims.put("created", new java.util.Date(System.currentTimeMillis()));
        claims.put("roles", this.extractRoles(userDetails));


        return Jwts.builder().setClaims(claims)
                .setExpiration(new java.util.Date(System.currentTimeMillis()
                        + SecurityConstants.EXPIRATION_TIME))
                .signWith(io.jsonwebtoken.SignatureAlgorithm.HS512, this.secret).compact();
    }


}
