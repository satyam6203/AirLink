package com.arilink.seat_service.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Configuration
public class JpaAuditingConfig {

    public static final String SYSTEM_AUDITOR = "system";

    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            try {
                ServletRequestAttributes attributes =
                        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
                if (attributes != null) {
                    String userId = attributes.getRequest().getHeader("X-User-Id");
                    if (userId != null && !userId.isBlank()) {
                        return Optional.of(userId);
                    }
                }
            } catch (Exception ignored) {
            }
            return Optional.of(SYSTEM_AUDITOR);
        };
    }
}
