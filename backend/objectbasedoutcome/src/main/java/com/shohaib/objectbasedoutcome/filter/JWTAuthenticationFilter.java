package com.shohaib.objectbasedoutcome.filter;

import com.shohaib.objectbasedoutcome.service.user.UserDetailsServiceImplementation;
import com.shohaib.objectbasedoutcome.util.JWTUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final JWTUtils tokenUtils;
    private final UserDetailsServiceImplementation userDetailsService;
//    private final TokenBlacklistService blacklistService;

    public JWTAuthenticationFilter(
            JWTUtils tokenUtils,
            UserDetailsServiceImplementation userDetailsService
    ) {
        this.tokenUtils = tokenUtils;
        this.userDetailsService = userDetailsService;
    }
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) req;
        String authToken = httpRequest.getHeader("Authorization");
        String username = tokenUtils.getUsername(authToken);
        if(authToken != null) {
            String pureToken = authToken.startsWith("Bearer ")
                    ? authToken.substring(7)
                    :authToken;
            System.out.println("Checking pure token:  "+pureToken);
        }
        if((username != null) && (SecurityContextHolder.getContext().getAuthentication() == null)){

            try
            {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                if (tokenUtils.validateToken(authToken, userDetails))
                {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(httpRequest));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (UsernameNotFoundException e)
            {
                // TODO: handle exception
            }

        }
        chain.doFilter(req, res);
    }
}
