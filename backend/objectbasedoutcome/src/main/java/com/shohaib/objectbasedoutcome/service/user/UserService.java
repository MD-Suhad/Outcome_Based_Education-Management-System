package com.shohaib.objectbasedoutcome.service.user;

import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserConflictException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;

import java.util.List;

public interface UserService {
    List<UserDTO> index();
    UserDTO show(Long id)
            throws UserNotFoundException;

    String store(UserDTO userDTO) throws UserNotFoundException, UserConflictException;

}
