package com.airlink.user_service.Service.Impl;

import com.airlink.user_service.Config.JwtProvider;
import com.airlink.user_service.Model.User;
import com.airlink.user_service.Repository.UserRepo;
import com.airlink.user_service.Service.AuthService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import payload.dto.UserDTO;
import payload.response.AuthResponse;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public AuthResponse signUp(UserDTO req) throws Exception {
        User existUser = userRepo.findByEmail(req.getEmail());
        if(existUser != null){
            throw new Exception("User Already exists with this email.");
        }
        if(req.getRole() == UserRole.ROLE_SYSTEM_ADMIN){
            throw new Exception("You cannot sign up system admin");
        }
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(req.getRole())
                .fullName(req.getFullName())
                .lastLogin(req.getLastLogin())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        User savedUser = userRepo.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());
        String jwt = jwtProvider.generateToken(authentication, savedUser.getId());
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setUser();
        authResponse.setTitle("Welcome "+ savedUser.getFullName());
        authResponse.setMessage("Register SuccessFully");
        return null;
    }

    @Override
    public AuthResponse login(String email, String password) {
        return null;
    }

}
