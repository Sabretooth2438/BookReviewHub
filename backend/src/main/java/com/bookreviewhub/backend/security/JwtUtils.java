package com.bookreviewhub.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

  @Value("${app.jwtSecret}")
  private String rawSecret;

  // Default expiration time is 1 hour (3600000 ms)
  
  @Value("${app.jwtExpirationMs:3600000}")
  private long expMs;

  private Key key;

  // Initialize the key using the raw secret

  @PostConstruct
  void init() {
    key = Keys.hmacShaKeyFor(rawSecret.getBytes(StandardCharsets.UTF_8));
  }

  // Generate a JWT token with email and role

  public String generate(String email, String role) {
    Date now = new Date();
    return Jwts.builder()
        .setSubject(email)
        .claim("role", role)
        .setIssuedAt(now)
        .setExpiration(new Date(now.getTime() + expMs))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean valid(String token) {
    try {
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public String email(String token) {
    return parse(token).getSubject();
  }

  public String role(String token) {
    return parse(token).get("role", String.class);
  }

  // helper
  private Claims parse(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(key)
        .build()
        .parseClaimsJws(token)
        .getBody();
  }
}
