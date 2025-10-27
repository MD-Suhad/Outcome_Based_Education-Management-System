package com.shohaib.objectbasedoutcome.service.user;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserConflictException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<UserDTO> index();
    UserDTO show(Long id)
            throws UserNotFoundException;

    String store(UserDTO userDTO) throws UserNotFoundException, UserConflictException;
    Optional<User> getByUsername(String username) throws UsernameNotFoundException, UserNotFoundException;

    Optional<User> getByUsernameAndPassword(String username, String password) throws UserNotFoundException;

    Optional<User> getByEmail(String email) throws UserException, UserNotFoundException;


}
