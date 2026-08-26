package com.airlink.user_service.Service.Impl;

import com.airlink.user_service.Model.User;
import com.airlink.user_service.Repository.UserRepo;
import enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeAdmin();
    }

    public void initializeAdmin(){
        String email = "satyamkumarsinghjaisidih@gmail.com";
        String password = "satya6203";
        User existingUser = userRepo.findByEmail(email);
        if(existingUser == null){
            User adminUser = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(UserRole.ROLE_SYSTEM_ADMIN)
                    .fullName("satyam kr singh")
                    .build();

            userRepo.save(adminUser);
        } else {
            boolean updated = false;
            if(!passwordEncoder.matches(password, existingUser.getPassword())){
                existingUser.setPassword(passwordEncoder.encode(password));
                updated = true;
            }
            if(existingUser.getRole() != UserRole.ROLE_SYSTEM_ADMIN){
                existingUser.setRole(UserRole.ROLE_SYSTEM_ADMIN);
                updated = true;
            }
            if(updated){
                userRepo.save(existingUser);
            }
        }
    }
}
