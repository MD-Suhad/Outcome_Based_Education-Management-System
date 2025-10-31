package com.shohaib.objectbasedoutcome.service.user;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.model.UserPermission;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class UserDetailsServiceImplementation implements UserDetailsService {

    @Autowired
    UserServiceImpl userService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user;
        try{
            user = userService.getByUsername(username);
        } catch (UserNotFoundException e) {
            user = null;
            throw new UsernameNotFoundException("User with given  username not found");
        }
        if(user.isPresent()){
            ArrayList<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            for(UserPermission userPermission: user.get().getUserPermissions()){

            }
        }
        return new org.springframework.security.core.userdetails.User(user.get().getUsername(),user.get().getPassword(),null);
    }
}
