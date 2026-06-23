package com.airlink.user_service.Service;

import payload.dto.UserDTO;
import payload.response.AuthResponse;

public interface AuthService {
    AuthResponse login(String email, String password);
    AuthResponse signUp(UserDTO req) throws Exception;
}
