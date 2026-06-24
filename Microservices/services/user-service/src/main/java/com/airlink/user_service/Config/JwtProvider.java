package com.airlink.user_service.Config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtProvider {

    private final SecretKey key = Keys.hmacShaKeyFor(
            JwtConstant.SECRET_KEY.getBytes()
    );

    public String generateToken(Authentication auth, Long userId){
        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        String roles = populateAuthorities(authorities);
        String jwt = Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .claim("email",auth.getName())
                .claim("authorities", roles)
                .claim("userId", userId)
                .signWith(key)
                .compact();
        return jwt;
    }

    private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();
        for(GrantedAuthority authority : authorities){
            auths.add(authority.getAuthority());
        }
        return String.join(",", auths);
    }
}
