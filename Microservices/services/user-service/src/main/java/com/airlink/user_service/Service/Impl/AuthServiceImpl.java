package com.airlink.user_service.Service.Impl;

import com.airlink.user_service.Config.JwtProvider;
import com.airlink.user_service.Mapper.UserMapper;
import com.airlink.user_service.Model.User;
import com.airlink.user_service.Repository.UserRepo;
import com.airlink.user_service.Service.AuthService;
import com.airlink.user_service.Service.CustomUserDetailsService;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    private final CustomUserDetailsService customUserDetailsService;

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
        authResponse.setUser(UserMapper.toDto(savedUser));
        authResponse.setTitle("Welcome "+ savedUser.getFullName());
        authResponse.setMessage("Register SuccessFully");
        return authResponse;
    }

    @Override
    public AuthResponse login(String email, String password) throws Exception {
        Authentication authentication = authenticate(email,password);

        User user = userRepo.findByEmail(email);
        user.setLastLogin(LocalDateTime.now());
        userRepo.save(user);

        String jwt = jwtProvider.generateToken(authentication, user.getId());
        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(jwt);
        authResponse.setUser(UserMapper.toDto(user));
        authResponse.setTitle("Welcome "+ user.getFullName());
        authResponse.setMessage("Login SuccessFully");
        return authResponse;
    }

    private Authentication authenticate(String email, String password) throws Exception {
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

        if(!passwordEncoder.matches(
                password, userDetails.getPassword()
        )){
            throw new Exception("Invalid Password");
        }

        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }
}
