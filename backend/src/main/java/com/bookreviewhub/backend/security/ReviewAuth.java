package com.bookreviewhub.backend.security;

import com.bookreviewhub.backend.model.Review;
import com.bookreviewhub.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReviewAuth {

  private final ReviewService svc;

  public boolean isOwner(String reviewId, String email) {
    Review r = svc.findById(reviewId);
    return r != null && r.getCreatedBy().equals(email);
  }
}
