package com.shohaib.objectbasedoutcome.api.v1.controller;

import com.shohaib.objectbasedoutcome.api.v1.request.StoreAndUpdateUserRequest;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.UserNotFoundException;
import com.shohaib.objectbasedoutcome.service.user.UserService;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/registrar")
    public Response<Object> userStore(@RequestBody @Validated StoreAndUpdateUserRequest storeAndUpdateUserRequest){
        UserDTO userDTO = new UserDTO()
                .setUsername(storeAndUpdateUserRequest.getName())
                .setFirstName(this.sanitize(storeAndUpdateUserRequest.getFirstName()))
                .setLastName(this.sanitize(storeAndUpdateUserRequest.getLastName()))
                .setPhoneNumber(this.sanitize(storeAndUpdateUserRequest.getPhoneNumber()))
                .setAddress(this.sanitize(storeAndUpdateUserRequest.getAddress()));
    }try {
        return Response.ok().setPayload(this.userService.store(userDTO));
    } catch (
    UserNotFoundException e) {
        return Response.exception().setErrors(errors(e.getMessage()));
    }

}
