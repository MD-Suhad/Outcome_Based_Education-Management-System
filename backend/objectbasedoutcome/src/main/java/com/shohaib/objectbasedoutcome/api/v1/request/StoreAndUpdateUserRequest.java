package com.shohaib.objectbasedoutcome.api.v1.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@JsonIgnoreProperties(ignoreUnknown = true)

public class StoreAndUpdateUserRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String phoneNumber;
    private String profileImage;
    private String address;
}
