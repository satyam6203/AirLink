package com.airlink.user_service.Controller;

import com.airlink.user_service.Model.User;
import com.airlink.user_service.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import payload.dto.UserDTO;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> findUserByEmail(
            @RequestHeader("X-User-Email") String email
    ) throws Exception {
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> findUserById(
            @PathVariable Long userId
    ) throws Exception {
        UserDTO user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> allUser(){
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
