package com.trustserve;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class Security {

    @Bean
    BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "https://trustserve.netlify.app"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of(
                "*"
        ));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity h) throws Exception {
        return h
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(c -> c.csrf(
                        csrf -> csrf.csrfTokenRepository(
                                CookieCsrfTokenRepository.withHttpOnlyFalse()
                        )
                ))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/", "/index.html", "/assets/**", "/images/**",
                                "/services/**", "/book/**", "/login", "/register",
                                "/dashboard", "/profile", "/support", "/about",
                                "/privacy", "/terms", "/how-it-works"
                        ).permitAll()

                        .requestMatchers(
                                "/api/auth/csrf", "/api/auth/login",
                                "/api/auth/register", "/api/services/**",
                                "/api/categories", "/api/professionals/**",
                                "/actuator/health"
                        ).permitAll()

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((q, r, x) -> r.sendError(401))
                        .accessDeniedHandler((q, r, x) -> r.sendError(403))
                )
                .build();
    }
}