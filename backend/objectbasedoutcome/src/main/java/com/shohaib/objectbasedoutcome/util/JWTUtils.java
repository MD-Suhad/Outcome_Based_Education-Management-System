package com.shohaib.objectbasedoutcome.util;
import com.shohaib.objectbasedoutcome.configuration.security.SecurityConstants;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JWTUtils {
    @Value("${auth.token.secret:github-secret-key-that-is-at-least-32-characters}")
    private String secret;

    private java.security.Key getSigningKey() {
        return Keys.hmacShaKeyFor(this.secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    private Claims getClaims(String token){
        Claims claims;
        try{
            claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        }catch (Exception e){
            claims = null;
        }
        return claims;
    }
    private boolean isExpired(String token){
        final Date expiration = this.getExpirationDate(token);
        return expiration != null && expiration.before(new Date(System.currentTimeMillis()));
    }

    public String getUsername(String token){
        String username;
        try{
            Claims claims = this.getClaims(token);
            username = claims != null ? claims.getSubject() : null;
        } catch (Exception e){
            username = null;
        }
        return username;
    }

    public Object getRoles(String token){
        Object roles;
        try{
            Claims claims = this.getClaims(token);
            roles = claims != null ? claims.get("roles") : null;
        } catch (Exception e){
            roles = null;
        }
        return roles;
    }

    public Date getExpirationDate(String token){
        Date expiration;
        try{
            final Claims claims = this.getClaims(token);
            expiration = claims != null ? claims.getExpiration() : null;
        } catch (Exception e){
            expiration = null;
        }
        return expiration;
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = getUsername(token);
        return username != null && username.equals(userDetails.getUsername()) && !isExpired(token);
    }

    public ArrayList<String> extractRoles(UserDetails userDetails){
        ArrayList<String> roles = new ArrayList<>();
        for(GrantedAuthority ga : userDetails.getAuthorities()){
            roles.add(ga.getAuthority());
        }
        return roles;
    }

    public String generateToken(UserDetails userDetails){
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", userDetails.getUsername());
        claims.put("created", new Date(System.currentTimeMillis()));
        claims.put("roles", this.extractRoles(userDetails));
        return Jwts.builder()
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

}
