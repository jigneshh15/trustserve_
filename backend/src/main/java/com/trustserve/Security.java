package com.trustserve;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
public class Security {

    @Bean
    BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity h) throws Exception {

        return h
            .csrf(c -> c.csrfTokenRepository(
                CookieCsrfTokenRepository.withHttpOnlyFalse()
            ))

            .authorizeHttpRequests(a -> a

                // Public frontend routes
                .requestMatchers(
                    HttpMethod.GET,
                    "/",
                    "/index.html",
                    "/assets/**",
                    "/images/**",
                    "/services/**",
                    "/book/**",
                    "/login",
                    "/register",
                    "/dashboard",
                    "/profile",
                    "/support",
                    "/about",
                    "/privacy",
                    "/terms",
                    "/how-it-works"
                ).permitAll()

                // Public API routes
                .requestMatchers(
                    "/api/auth/csrf",
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/services/**",
                    "/api/categories",
                    "/api/professionals/**",
                    "/actuator/health"
                ).permitAll()

                // Admin-only routes
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // All remaining endpoints require authentication
                .anyRequest().authenticated()
            )

            .exceptionHandling(e -> e
                .authenticationEntryPoint(
                    (q, r, x) -> r.sendError(401)
                )
                .accessDeniedHandler(
                    (q, r, x) -> r.sendError(403)
                )
            )

            .build();
    }
}