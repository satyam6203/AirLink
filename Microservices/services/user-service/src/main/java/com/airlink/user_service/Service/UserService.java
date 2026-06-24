package com.airlink.user_service.Service;

import com.airlink.user_service.Model.User;
import payload.dto.UserDTO;

import java.util.List;

public interface UserService {
    UserDTO getUserByEmail(String email) throws Exception;
    UserDTO getUserById(Long id) throws Exception;
    List<UserDTO> getAllUsers();
}
