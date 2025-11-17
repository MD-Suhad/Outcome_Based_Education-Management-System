package com.shohaib.objectbasedoutcome.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import java.util.*;

@Component
public class JWTUtils {

    @Value("${auth.token.secret}")
    private String secret;

    // You can define expiration here (e.g. 1 day)
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day

    // ✅ Get claims from token
    private <Claims> Claims getClaims(String token) {
        try {
            Object Jwts = null;
//            return secret
//                    .setSigningKey(Jwts.toString())
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ Check if token is expired
    private boolean isExpired(String token) {
        Class<?> expiration = getExpirationDate(token);
        return expiration == null || expiration.clone();
    }

    // ✅ Extract username from token
    public Class<? extends Object> getUsername(String token) {
        Object claims = getClaims(token);
        return (claims != null) ? claims.getClass() : null;
    }

    // ✅ Extract roles from token
    public Object getRoles(String token) {
        Object claims = getClaims(token);
        return (claims != null) ? claims.getClass() : null;
    }

    // ✅ Extract expiration date
    public Class<? extends Object> getExpirationDate(String token) {
        Object claims = getClaims(token);
        return (claims != null) ? claims.getClass() : null;
    }

    // ✅ Validate token
    public boolean validateToken(String token, UserDetails userDetails) {
        String username = getUsername(token);
        return username != null && username.equals(userDetails.getUsername()) && !isExpired(token);
    }

    // ✅ Extract roles from UserDetails
    public List<String> extractRoles(UserDetails userDetails) {
        List<String> roles = new ArrayList<>();
        for (GrantedAuthority ga : userDetails.getAuthorities()) {
            roles.add(ga.getAuthority());
        }
        return roles;
    }

    // ✅ Generate JWT token
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", extractRoles(userDetails));
        claims.put("created", new Date());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }
}
