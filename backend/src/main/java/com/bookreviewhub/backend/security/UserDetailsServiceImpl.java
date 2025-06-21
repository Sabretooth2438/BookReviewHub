package com.bookreviewhub.backend.security;

import com.bookreviewhub.backend.model.User;
import com.bookreviewhub.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

  private final UserService svc;

  @Override
  public UserDetails loadUserByUsername(String email) {
    User u = svc.findByEmail(email);
    if (u == null)
      throw new UsernameNotFoundException("No user " + email);
    return org.springframework.security.core.userdetails.User
        .withUsername(u.getEmail())
        .password(u.getPassword())
        .authorities(new SimpleGrantedAuthority("ROLE_" + u.getRole()))
        .build();
  }
}
