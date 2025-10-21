package com.shohaib.objectbasedoutcome.service.user;

import com.shohaib.objectbasedoutcome.domain.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserDetailsServiceImplementation implements UserDetailsService {

    @Autowired
    UserServiceImpl userService;

    @Override

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user;
        try{
            user = user.getBy
        }
        return null;
    }
}
