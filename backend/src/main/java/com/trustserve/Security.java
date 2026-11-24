
package com.trustserve;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import java.util.List;

@Configuration
public class Security {

    @Bean
    BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    // CORS configuration for Netlify frontend
    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(
            List.of("https://trustserve.netlify.app")
        );

        config.setAllowedMethods(
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );

        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Set-Cookie"));

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity h) throws Exception {

        CookieCsrfTokenRepository repository =
            CookieCsrfTokenRepository.withHttpOnlyFalse();

        // Allow CSRF cookie to work across Netlify and Render
        repository.setCookieCustomizer(cookie -> cookie
            .secure(true)
            .sameSite("None")
        );

        return h

            .cors(c -> c.configurationSource(corsConfigurationSource()))

            .csrf(c -> c.csrfTokenRepository(repository))

            .authorizeHttpRequests(a -> a

                // Public frontend routes
                .requestMatchers(
                    HttpMethod.GET,
                    "/", "/index.html", "/assets/**", "/images/**",
                    "/services/**", "/book/**", "/login", "/register",
                    "/dashboard", "/profile", "/support", "/about",
                    "/privacy", "/terms", "/how-it-works"
                ).permitAll()

                // Public API endpoints
                .requestMatchers(
                    "/api/auth/csrf",
                    "/api/auth/login",
                    "/api/auth/register",
                    "/api/services/**",
                    "/api/categories",
                    "/api/professionals/**",
                    "/actuator/health"
                ).permitAll()

                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Everything else requires authentication
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
