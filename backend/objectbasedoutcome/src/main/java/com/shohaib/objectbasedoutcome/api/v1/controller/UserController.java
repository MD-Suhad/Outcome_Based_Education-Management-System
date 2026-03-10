package com.shohaib.objectbasedoutcome.api.v1.controller;

import com.shohaib.objectbasedoutcome.api.v1.request.StoreAndUpdateUserRequest;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserConflictException;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import com.shohaib.objectbasedoutcome.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/auth")
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/user-all")
    public ResponseEntity<Object> index(){
        return ResponseEntity.ok(this.userService.index());
    }
    @GetMapping("/user-show-id/{id}")
    public ResponseEntity<Object> show(@PathVariable ("id") Long id){
        try {
            return ResponseEntity.ok(this.userService.show(id));
        }catch (UserNotFoundException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/registrar")
    public ResponseEntity<Object> userStore(@RequestBody @Validated StoreAndUpdateUserRequest request) {
        try {
            UserDTO userDTO = new UserDTO()
                    .setEmail(sanitize(request.getEmail()))
                    .setFirstName(sanitize(request.getFirstName()))
                    .setLastName(sanitize(request.getLastName()))
                    .setPassword("12345678")
                    .setPhoneNumber(sanitize(request.getPhoneNumber()))
                    .setAddress(sanitize(request.getAddress()));
            userService.checkForPassword("12345678", "12345678");

            return ResponseEntity.ok(userService.store(userDTO));

        } catch (UserNotFoundException | UserConflictException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.trim().replaceAll("<[^>]*>", "");
    }
}

