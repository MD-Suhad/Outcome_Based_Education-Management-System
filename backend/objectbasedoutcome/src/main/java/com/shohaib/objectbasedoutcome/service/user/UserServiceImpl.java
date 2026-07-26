package com.shohaib.objectbasedoutcome.service.user;

import com.shohaib.objectbasedoutcome.domain.model.Permission;
import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.domain.model.UserPermission;
import com.shohaib.objectbasedoutcome.domain.repository.UserPermissionRepository;
import com.shohaib.objectbasedoutcome.domain.repository.UserRepository;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.mapper.UserMapper;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserConflictException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import com.shohaib.objectbasedoutcome.util.JWTUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserPermissionRepository userPermissionRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserDetailsServiceImplementation userService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTUtils jwt;

    @Override
    public List<UserDTO> index() {
        Iterable<User> users = userRepository.findAll();

        return StreamSupport.stream(users.spliterator(), false)
                .map(user -> new UserDTO()
                        .setId(user.getId())
                        .setUsername(user.getUsername())
                        .setEmail(user.getEmail())
                        .setFirstName(user.getFirstName())
                        .setLastName(user.getLastName())
                        .setProfileImage(user.getProfileImage())
                        .setPhoneNumber(user.getPhoneNumber())
                        .setAddress(user.getAddress())
                )
                .toList();
    }

    @Override
    public UserDTO show(Long id) throws UserNotFoundException {
        User user =  this.userRepository.findById(id).orElseThrow(()-> new UserNotFoundException(String.format("User id not found ")));
        return UserMapper.map(user);
    }

    @Override
    public Optional<User> getById(Long id) throws UserException, UserNotFoundException {
        Optional<User> user = userRepository.findById(id);
        if(user.isEmpty()){
            throw new UserNotFoundException(String.format("User with id:",id));
        }else {
            return user;
        }
    }

    @Override
    public String store(UserDTO userDTO) throws UserNotFoundException, UserConflictException {
        Random rnd = new Random();
        int number = Math.abs(rnd.nextInt() % 10000);

        if (userDTO.getEmail() != null && userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new UserConflictException("User with email: '" + userDTO.getEmail() + "' already exists");
        }

        String username = userDTO.getUsername();
        if (username == null || username.isBlank()) {
            String fname = userDTO.getFirstName() != null ? userDTO.getFirstName().replace(" ", "").toLowerCase() : "user";
            String lname = userDTO.getLastName() != null ? userDTO.getLastName().replace(" ", "").toLowerCase() : "";
            username = fname + lname + String.format("%04d", number);
        }

        User user = new User()
                .setUsername(username)
                .setFirstName(userDTO.getFirstName())
                .setLastName(userDTO.getLastName())
                .setPassword(passwordEncoder.encode(userDTO.getPassword()))
                .setEmail(userDTO.getEmail())
                .setProfileImage("users/user-icon.png")
                .setPhoneNumber(userDTO.getPhoneNumber())
                .setAddress(userDTO.getAddress());

        this.userRepository.save(user);

        try {
            Permission roleUser = userPermissionRepository.ROLE_USER();
            if (roleUser != null) {
                user.setUserPermissions(new HashSet<>());
                user.getUserPermissions().add(new UserPermission(null, user, roleUser));
                userRepository.save(user);
            }
        } catch (Exception e) {
            // Permission assignment fallback
        }

        return "User Registration Successfully";
    }

    @Override
    public Optional<User> getByUsername(String username) throws UserNotFoundException {
        Optional<User> user = userRepository.findByUsernameAndDeletedFalse(username);
        if (user.isEmpty()) {
            user = userRepository.findByEmail(username);
        }
        if (user.isEmpty()) {
            throw new UserNotFoundException(
                    String.format("User with given username/email: '%s' does not exist", username)
            );
        } else {
            return user;
        }
    }

    @Override
    public List<User> getAll() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public Optional<User> getByUsernameAndPassword(String username, String password) throws UserNotFoundException {
        Optional<User> user = userRepository.findByUsernameAndPasswordAndDeletedFalse(username, password);
        if (user.isEmpty()) {
            throw new UserNotFoundException(String.format("user with given username and password: '%s': '%d' does not exist ", username, password));
        } else {
            return user;
        }
    }

    @Override
    public Optional<User> getByEmail(String email) throws UserNotFoundException {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException(String.format("email not found", email));
        } else {
            return user;
        }
    }

    @Override
    public void checkForPassword(String password, String confirmPassword) throws UserNotFoundException {
        if (!password.equals(confirmPassword)) {
            throw new UserNotFoundException("password don't match");
        }
    }

    @Override
    public HashMap<String, Object> login(UserDTO userDTO) throws UserException, UserNotFoundException {
        String identifier = userDTO.getUsername() != null && !userDTO.getUsername().isBlank() 
                ? userDTO.getUsername() 
                : userDTO.getEmail();

        Optional<User> userOpt = this.userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = this.userRepository.findByEmail(identifier);
        }

        User user = userOpt.orElseThrow(() -> new UserNotFoundException("User not found with email/username: " + identifier));

        try {
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user.getUsername(), userDTO.getPassword());
            UserDetails userDetails = this.userService.loadUserByUsername(user.getUsername());
            Authentication authentication = this.authenticationManager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            this.userRepository.save(user);

            String userToken = jwt.generateToken(userDetails);
            HashMap<String, Object> data = new HashMap<>();
            data.put("Success", true);
            data.put("Message", "Login Successfully");
            data.put("accessToken", userToken);
            data.put("refreshToken", userToken);
            data.put("token", userToken);
            data.put("user", UserMapper.map(user));
            return data;
        } catch (BadCredentialsException e) {
            throw new UserException("Username Or Password Don't Match");
        }
    }

    @Override
    public String delete(Long id) throws UserNotFoundException {
        User user = this.userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User Not Found"));
        this.userRepository.deleteById(user.getId());
        return "User Delete Successfully";
    }

    @Override
    public String updatePassword(UserDTO userDTO) throws UserNotFoundException {
        try{
            User user = this.userRepository.findByUsername(userDTO.getUsername()).orElseThrow(()-> new UserNotFoundException("User Id not found"));
            user.setPassword(userDTO.getPassword());
            userRepository.save(user);
            return "Password has been Changed";
            }catch (UserNotFoundException e){
            throw new UserNotFoundException(e.getMessage());
        }
    }


}
