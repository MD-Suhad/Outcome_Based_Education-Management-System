package com.shohaib.objectbasedoutcome.service.user;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.model.UserPermission;
import com.shohaib.objectbasedoutcome.domain.repository.UserPermissionRepository;
import com.shohaib.objectbasedoutcome.domain.repository.UserRepository;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserConflictException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserPermissionRepository userPermissionRepository;
    @Override
    public List<UserDTO> index() {
        return null;
    }

    @Override
    public UserDTO show(Long id) throws UserNotFoundException {
        return null;
    }

    @Override
    public String store(UserDTO userDTO) throws UserNotFoundException, UserConflictException {
        Random rnd = new Random();
        int number = rnd.nextInt();
        Optional<User> foundedUser = userRepository.findByUsername(userDTO.getUsername());
        if(foundedUser.isPresent()){
            throw new UserConflictException(String.format("User with username: '%s' already exists",userDTO.getUsername()));
        }else {
            User user = new User()
                    .setUsername(userDTO.getFirstName().replace(" ","").toLowerCase() + userDTO.getLastName().replace(" "," ").toLowerCase() + String.format("%04d",number))
                    .setPassword(userDTO.getPassword())
                    .setEmail(userDTO.getEmail())
                    .setProfileImage("users/user-icon.png")
                    .setPhoneNumber(userDTO.getPhoneNumber())
                    .setAddress(userDTO.getAddress());
            this.userRepository.save(user);
            user.setUserPermissions(new HashSet<>());
            user.getUserPermissions()
                    .add(new UserPermission(null,user,userPermissionRepository.ROLE_USER()));
            userRepository.save(user);
            return "User Registration Successfully";
        }
    }

    @Override
    public Optional<User> getByUsername(String username) throws UserNotFoundException{
        Optional<User> user = userRepository.findByUsernameAndDeletedFalse(username);
        if(user.isEmpty()){
            throw new UserNotFoundException(
                    String.format("User with given username: '%s' does not exist",username)
            )
        }else {
            return user;
        }
    }

}
