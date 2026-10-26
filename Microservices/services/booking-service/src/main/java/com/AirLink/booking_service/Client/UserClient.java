package com.AirLink.booking_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import payload.dto.UserDTO;

@FeignClient(name = "user-service")
public interface UserClient {
    
    @GetMapping("/api/users/{userId}")
    UserDTO findUserById(@PathVariable Long userId);
}
