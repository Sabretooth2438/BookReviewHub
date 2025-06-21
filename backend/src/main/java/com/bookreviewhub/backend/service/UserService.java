package com.bookreviewhub.backend.service;

import com.bookreviewhub.backend.model.User;
import com.bookreviewhub.backend.model.enums.Role;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class UserService {

  private final PasswordEncoder encoder;

  private static final String COL = "users";

  private Firestore db() {
    return FirestoreClient.getFirestore();
  }

  public User findByEmail(String email) {
    try {
      ApiFuture<QuerySnapshot> fut = db()
          .collection(COL)
          .whereEqualTo("email", email)
          .get();

      List<QueryDocumentSnapshot> docs = fut.get().getDocuments();
      return docs.isEmpty() ? null : docs.get(0).toObject(User.class);

    } catch (InterruptedException | ExecutionException e) {
      throw new RuntimeException(e);
    }
  }

  public User register(String email, String rawPw, Role role) {
    String hash = encoder.encode(rawPw);
    User u = new User(UUID.randomUUID().toString(), email, hash, role);
    db().collection(COL).document(u.getId()).set(u);
    return u;
  }

  public void updatePassword(String email, String raw) {
    User u = findByEmail(email);
    if (u == null)
      throw new RuntimeException("No user");
    u.setPassword(encoder.encode(raw));
    db().collection(COL).document(u.getId()).set(u);
  }

  public boolean matches(String rawPw, String hash) {
    return encoder.matches(rawPw, hash);
  }

}
