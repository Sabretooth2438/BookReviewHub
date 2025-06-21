package com.bookreviewhub.backend.model;

import com.bookreviewhub.backend.model.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  private String id;
  private String email;
  private String password;
  private Role role;
}
