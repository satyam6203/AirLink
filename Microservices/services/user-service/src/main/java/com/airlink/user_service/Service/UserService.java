package com.airlink.user_service.Service;

import com.airlink.user_service.Model.User;

import java.util.List;

public interface UserService {
    User getUserByEmail(String email) throws Exception;
    User getUserById(Long id) throws Exception;
    List<User> getAllUsers();
}
