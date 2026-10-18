package com.AirLink.payment_service.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import payload.dto.UserDTO;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/api/user/{userId}")
    UserDTO findUserById(@PathVariable Long userId);
}
