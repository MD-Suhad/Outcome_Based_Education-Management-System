package com.shohaib.objectbasedoutcome.mapper;

import com.shohaib.objectbasedoutcome.domain.model.User;
import com.shohaib.objectbasedoutcome.dto.model.UserDTO;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserDTO map(User user){

        return new UserDTO()
                .setId(user.getId())
                .setEmail(user.getEmail())
                .setAddress(user.getAddress())
                .setPassword(user.getPassword());

    }
    public static List<UserDTO> map (List<User>users){
        return users.stream().map(UserMapper::map).collect(Collectors.toList());
    }

}
