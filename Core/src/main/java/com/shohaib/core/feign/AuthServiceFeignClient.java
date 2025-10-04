package com.shohaib.core.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import com.shohaib.core.domain.model.ULAUserDTO;
import com.shohaib.core.feign.hystrix.AuthServiceFallbackFactory;
import com.shohaib.core.api.response.Response;


@FeignClient(value = "ula-auth-service", fallbackFactory = AuthServiceFallbackFactory.class)
public interface AuthServiceFeignClient
{
    @PostMapping("/private/user")
    ULAUserDTO getUser(@RequestHeader(value = "Authorization", required = true) String token, @RequestBody String authorizeRoles);

    @GetMapping("/student/{id}")
    Response<Object> getStudent
            (
                    @PathVariable("id") Long id,
                    @RequestHeader(value = "Authorization") String token
            );

}
