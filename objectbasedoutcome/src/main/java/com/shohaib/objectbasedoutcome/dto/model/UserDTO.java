package com.shohaib.objectbasedoutcome.dto.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class UserDTO {
    private Long id;
    private String username;

    private String email;

    private String password;

    private String profileImage;

    private String firstName;

    private String lastName;

    private String phoneNumber;

    private String address;
    private boolean emailVerified;
    private String ipAddress;
    private List<UserPermissionDTO> userPermissionDTOList;
}
