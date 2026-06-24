package com.airlink.user_service.Service.Impl;

import com.airlink.user_service.Model.User;
import com.airlink.user_service.Repository.UserRepo;
import com.airlink.user_service.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    @Override
    public User getUserByEmail(String email) throws Exception {
        User user = userRepo.findByEmail(email);
        if(user == null){
            throw new Exception("User not found with provided email");
        }
        return user;
    }

    @Override
    public User getUserById(Long id) throws Exception {
        User user = userRepo.findById(id).orElseThrow(
                () -> new Exception("User not found with this id " + id)
        );
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }
}
