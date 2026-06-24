package com.airlink.user_service.Service.Impl;

import com.airlink.user_service.Mapper.UserMapper;
import com.airlink.user_service.Model.User;
import com.airlink.user_service.Repository.UserRepo;
import com.airlink.user_service.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import payload.dto.UserDTO;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;

    @Override
    public UserDTO getUserByEmail(String email) throws Exception {
        User user = userRepo.findByEmail(email);
        if(user == null){
            throw new Exception("User not found with provided email");
        }
        return UserMapper.toDto(user);
    }

    @Override
    public UserDTO getUserById(Long id) throws Exception {
        User user = userRepo.findById(id).orElseThrow(
                () -> new Exception("User not found with this id " + id)
        );
        return UserMapper.toDto(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> user = userRepo.findAll();
        return UserMapper.toDtoList(user);
    }
}
