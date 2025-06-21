package com.bookreviewhub.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter filter;
  private final UserDetailsServiceImpl uds;
  private final PasswordEncoder encoder;

  // CORS configuration

  @Bean
  CorsFilter corsFilter() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.addAllowedOrigin("http://localhost:5173");
    cfg.addAllowedHeader("*");
    cfg.addAllowedMethod("*");
    cfg.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return new CorsFilter(src);
  }

  // Authentication manager

  @Bean
  AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    var builder = http.getSharedObject(AuthenticationManagerBuilder.class);
    builder.userDetailsService(uds).passwordEncoder(encoder);
    return builder.build();
  }

  // Security filter chain

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        .cors(Customizer.withDefaults())
        .csrf(cs -> cs.disable())
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/signup", "/api/auth/login").permitAll()

            .requestMatchers(HttpMethod.GET,
                "/api/books",
                "/api/books/**",
                "/api/reviews/**")
            .permitAll()
            .requestMatchers(HttpMethod.POST, "/api/books/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")

            .anyRequest().authenticated())

        .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
