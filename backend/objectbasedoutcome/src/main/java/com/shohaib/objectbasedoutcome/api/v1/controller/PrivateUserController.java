package com.shohaib.objectbasedoutcome.api.v1.controller;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.mapper.UserMapper;
import com.shohaib.objectbasedoutcome.service.user.UserDetailsServiceImplementation;
import com.shohaib.objectbasedoutcome.service.user.UserService;
import com.shohaib.objectbasedoutcome.util.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
public class PrivateUserController {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImplementation userDetailsService;

    @Autowired
    private UserService userService;

    @PostMapping("/private/user")
    public UserDTO getUser(
            @RequestHeader(value = "Authorization", required = true) String token,
            @RequestBody(required = false) String authorizeRoles) {
        
        if (token == null) {
            return null;
        }

        String pureToken;
        if (token.startsWith("Bearer ")) {
            pureToken = token.substring(7).trim();
        } else {
            pureToken = token.trim();
        }

        String username = jwtUtils.getUsername(pureToken);
        if (username == null) {
            return null;
        }

        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtUtils.validateToken(pureToken, userDetails)) {
                if (hasAnyRole(userDetails, authorizeRoles)) {
                    User user = userService.getByUsername(username).orElse(null);
                    if (user != null) {
                        return UserMapper.map(user);
                    }
                }
            }
        } catch (Exception e) {
            // Token verification failed or user not found
        }
        return null;
    }

    private boolean hasAnyRole(UserDetails userDetails, String authorizeRoles) {
        if (authorizeRoles == null || authorizeRoles.trim().isEmpty() || authorizeRoles.equals("[]")) {
            return true;
        }
        
        String rolesStr = authorizeRoles.replace("[", "").replace("]", "").trim();
        if (rolesStr.isEmpty()) {
            return true;
        }
        
        String[] requiredRoles = rolesStr.split(",");
        for (String reqRole : requiredRoles) {
            String roleTrim = reqRole.trim();
            if (roleTrim.isEmpty()) continue;
            
            for (org.springframework.security.core.GrantedAuthority authority : userDetails.getAuthorities()) {
                String userAuth = authority.getAuthority();
                if (userAuth.equalsIgnoreCase(roleTrim) || 
                    userAuth.equalsIgnoreCase("ROLE_" + roleTrim) ||
                    roleTrim.equalsIgnoreCase("ROLE_" + userAuth)) {
                    return true;
                }
            }
        }
        return false;
    }
}
