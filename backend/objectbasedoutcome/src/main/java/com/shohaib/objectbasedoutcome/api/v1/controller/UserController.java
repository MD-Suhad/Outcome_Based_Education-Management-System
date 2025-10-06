package com.shohaib.objectbasedoutcome.api.v1.controller;

import com.shohaib.objectbasedoutcome.api.v1.request.StoreAndUpdateUserRequest;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserException;
//import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
//import com.shohaib.objectbasedoutcome.service.exception.handler.PasswordsDontMatchException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserConflictException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import com.shohaib.objectbasedoutcome.service.user.UserService;
//import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
public class UserController {

    @Autowired
    private UserService userService;

//    @Autowired
//    private PasswordEncoder passwordEncoder;

    @PostMapping("/user-registrar")
    public ResponseEntity<Object> userStore(@RequestBody @Validated StoreAndUpdateUserRequest request) {
        try {
            UserDTO userDTO = new UserDTO()
                    .setEmail(sanitize(request.getEmail()))
                  //  .setPassword(passwordEncoder.encode("12345678"))
                    .setFirstName(sanitize(request.getFirstName()))
                    .setLastName(sanitize(request.getLastName()))
                    .setPhoneNumber(sanitize(request.getPhoneNumber()))
                    .setAddress(sanitize(request.getAddress()));

            // Check password match and T&C
//            userService.checkForPasswords("12345678", "12345678");
//            userService.checkTermsAndConditions(request.getAcceptTerms());

            // Save and return OK
            return ResponseEntity.ok(userService.store(userDTO));

        } catch (UserNotFoundException | UserConflictException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("<[^>]*>", ""); // basic XSS prevention
    }
}
