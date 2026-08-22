package com.AirLine.Config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtUtils {

    private final SecretKey secretKey;

    public JwtUtils(){
        this.secretKey = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
    }

    public Claims extractAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token){
        return extractAllClaims(token).get("email", String.class);
    }

    public String extractAuthorities(String token){
        return extractAllClaims(token).get("authorities", String.class);
    }

    public Long extractUser(String token){
        return extractAllClaims(token).get("userId", Long.class);
    }

    public boolean isTokenValid(String token){
        try {
            extractAllClaims(token);
            return true;
        }
        catch (Exception e) {
            return false;
        }
    }

    public Duration getRemainingValidity(String token){
        Date expiration = extractAllClaims(token).getExpiration();
        return Duration.between(Instant.now(), expiration.toInstant());
    }
}
