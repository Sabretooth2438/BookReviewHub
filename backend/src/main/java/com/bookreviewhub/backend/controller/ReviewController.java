package com.bookreviewhub.backend.controller;

import com.bookreviewhub.backend.model.Book;
import com.bookreviewhub.backend.model.Review;
import com.bookreviewhub.backend.service.ReviewService;
import com.bookreviewhub.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

  private final ReviewService svc;
  private final UserService users;

  // Public

  @GetMapping("/book/{bookId}")
  public List<Review> ofBook(@PathVariable String bookId) {
    return svc.ofBook(bookId);
  }

  // User

  @PostMapping("/book/{bookId}")
  @PreAuthorize("isAuthenticated()")
  public Book create(@PathVariable String bookId,
      @RequestBody Review r,
      Authentication a) throws Exception {
    r.setBookId(bookId);
    r.setCreatedBy(a.getName());
    if (r.isAnonymous()) {
      r.setUsername("Anonymous");
      r.setAvatarUrl("");
    } else {
      var u = users.findByEmail(a.getName());
      r.setUsername(u.getUsername());
      r.setAvatarUrl(u.getAvatarUrl());
    }
    return svc.create(r);
  }

  // Owner or Admin

  @PutMapping("/{id}")
  @PreAuthorize("@reviewAuth.isOwner(#id, authentication.name) or hasRole('ADMIN')")
  public Book update(@PathVariable String id,
      @RequestBody Review r,
      Authentication a) throws Exception {
    r.setId(id);
    r.setCreatedBy(a.getName());
    if (r.isAnonymous()) {
      r.setUsername("Anonymous");
      r.setAvatarUrl("");
    } else {
      var u = users.findByEmail(a.getName());
      r.setUsername(u.getUsername());
      r.setAvatarUrl(u.getAvatarUrl());
    }
    return svc.update(r);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("@reviewAuth.isOwner(#id, authentication.name) or hasRole('ADMIN')")
  public void delete(@PathVariable String id) throws Exception {
    svc.delete(id);
  }
}
