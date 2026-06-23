package com.airlink.user_service.Config;

import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

import javax.crypto.SecretKey;


@RequiredArgsConstructor
public class JwtProvider {

    private final SecretKey key = Keys.hmacShaKeyFor();


}
