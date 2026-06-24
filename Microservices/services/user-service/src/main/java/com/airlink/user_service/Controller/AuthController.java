package com.airlink.user_service.Controller;

import com.airlink.user_service.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import payload.dto.UserDTO;
import payload.request.LoginRequest;
import payload.response.AuthResponse;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signUp")
    public ResponseEntity<AuthResponse> signUp(
            @RequestBody @Valid UserDTO userDTO) throws Exception
    {
        AuthResponse response = authService.signUp(userDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody @Valid LoginRequest request
    ) throws Exception {
        AuthResponse response = authService.login(request.getEmail(),request.getPassword());
        return ResponseEntity.ok(response);
    }
}
