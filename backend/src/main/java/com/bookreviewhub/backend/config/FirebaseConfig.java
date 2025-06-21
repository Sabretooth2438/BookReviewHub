package com.bookreviewhub.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class FirebaseConfig {

  @PostConstruct
  public void init() {
    try (var in = getClass().getResourceAsStream("/firebase/serviceAccountKey.json")) { // classpath lookup
      if (in == null) {
        log.error("serviceAccountKey.json not found in classpath");
        return;
      }
      FirebaseOptions options = FirebaseOptions.builder()
          .setCredentials(GoogleCredentials.fromStream(in))
          .build();
      if (FirebaseApp.getApps().isEmpty()) {
        FirebaseApp.initializeApp(options);
        log.info("Firebase initialised");
      }
    } catch (Exception e) {
      log.error("Firebase init failed: {}", e.getMessage());
    }
  }
}
