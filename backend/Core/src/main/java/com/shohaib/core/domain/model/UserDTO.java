package com.shohaib.core.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class UserDTO
{
    private Long id;
    private String username;
    @JsonIgnore
    private String password;
    private String email;
    private String profileImage;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    @JsonIgnore
    private String termsAndConditions;
}
