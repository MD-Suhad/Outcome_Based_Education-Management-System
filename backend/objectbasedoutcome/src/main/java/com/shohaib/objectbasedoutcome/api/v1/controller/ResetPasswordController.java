package com.shohaib.objectbasedoutcome.api.v1.controller;

import com.shohaib.core.api.response.Response;
import com.shohaib.objectbasedoutcome.api.v1.request.ResetPasswordRequest;
import com.shohaib.objectbasedoutcome.dto.model.PasswordResetDTO;
import com.shohaib.objectbasedoutcome.service.exception.handler.PasswordDontMatchException;
import com.shohaib.objectbasedoutcome.service.passwordReset.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Validated
public class ResetPasswordController {
    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/password-reset")
    public Response<Object> resetPassword(@RequestBody @Valid ResetPasswordRequest resetPasswordRequest, Error error){
        PasswordResetDTO passwordResetDTO = new PasswordResetDTO()
                .setNewPassword(resetPasswordRequest.getNewPassword())
                .setConfirmPassword(resetPasswordRequest.getConfirmPassword())
                .setToken(resetPasswordRequest.getToken());
        try{
            return Response.ok().setPayload(this.passwordResetService.verityEmailToken(passwordResetDTO));
        }catch (PasswordDontMatchException e){
            return Response.ok().setErrors(e.getMessage());
        }
    }

}
