package com.shohaib.core.domain.model;

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
    private ArrayList<String> roles;
}
