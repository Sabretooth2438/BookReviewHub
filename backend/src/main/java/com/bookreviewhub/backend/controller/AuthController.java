package com.bookreviewhub.backend.controller;

import com.bookreviewhub.backend.model.User;
import com.bookreviewhub.backend.model.enums.Role;
import com.bookreviewhub.backend.security.JwtUtils;
import com.bookreviewhub.backend.service.UserService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthenticationManager am;
  private final UserService users;
  private final JwtUtils jwt;

  /* ---------- signup & login ---------- */

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody Signup dto) {
    users.register(dto.email, dto.password, Role.USER);
    return ResponseEntity.ok(Map.of("msg", "registered"));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Login dto) {
    Authentication auth = am.authenticate(
        new UsernamePasswordAuthenticationToken(dto.email, dto.password));

    String token = jwt.generate(
        dto.email,
        auth.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""));

    return ResponseEntity.ok(Map.of("token", token));
  }

  /* ---------- password reset ---------- */

  @PostMapping("/reset-password")
  public ResponseEntity<?> reset(@RequestBody Pw dto, Authentication a) {
    if (a == null)
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    String email = a.getName();
    User u = users.findByEmail(email);

    if (u == null || !users.matches(dto.oldPassword(), u.getPassword()))
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Old password incorrect");

    users.updatePassword(email, dto.newPassword());
    return ResponseEntity.ok(Map.of("msg", "password updated"));
  }

  /* ---------- profile ---------- */

  @GetMapping("/profile")
  public ResponseEntity<?> profile(Authentication a) {
    if (a == null)
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    User u = users.findByEmail(a.getName());
    if (u == null)
      return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    var view = new ProfileView(u.getEmail(), u.getUsername(),
        u.getAvatarUrl(), u.getRole());
    return ResponseEntity.ok(view);
  }

  @PutMapping("/profile")
  public ResponseEntity<?> updateProfile(@RequestBody Profile dto, Authentication a) {
    if (a == null)
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    users.updateProfile(a.getName(), dto.username);
    return ResponseEntity.ok(Map.of("msg", "profile updated"));
  }

  @PostMapping("/profile/avatar")
  public ResponseEntity<?> updateAvatar(@RequestParam("file") MultipartFile file,
      Authentication a) {
    if (a == null)
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

    String url = users.updateAvatar(a.getName(), file);
    return ResponseEntity.ok(Map.of("url", url));
  }

  /* ---------- DTOs ---------- */

  @Data
  static class Signup {
    @Email
    @NotBlank
    String email;
    @NotBlank
    String password;
  }

  @Data
  static class Login {
    @Email
    @NotBlank
    String email;
    @NotBlank
    String password;
  }

  @Data
  static class Profile {
    String username;
  }

  @Data
  static class ProfileView {
    String email;
    String username;
    String avatarUrl;
    Role role;

    public ProfileView(String email, String username,
        String avatarUrl, Role role) {
      this.email = email;
      this.username = username;
      this.avatarUrl = avatarUrl;
      this.role = role;
    }
  }

  /* password-reset record */
  record Pw(String oldPassword, String newPassword) {
  }
}
