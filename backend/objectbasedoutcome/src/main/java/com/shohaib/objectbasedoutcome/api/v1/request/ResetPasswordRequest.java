package com.shohaib.objectbasedoutcome.api.v1.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResetPasswordRequest {
    @NotEmpty(message = "Reset password token is required")
    private String token;

    @NotEmpty(message = "Password is required")
    private String newPassword;

    @NotEmpty(message = "Password confirmation is required")
    private String confirmPassword;
    private String email;
}
