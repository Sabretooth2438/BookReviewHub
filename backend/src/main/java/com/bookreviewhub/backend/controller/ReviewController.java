package com.bookreviewhub.backend.controller;

import com.bookreviewhub.backend.model.Review;
import com.bookreviewhub.backend.service.ReviewService;
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

  // Public

  @GetMapping("/book/{bookId}")
  public List<Review> ofBook(@PathVariable String bookId) {
    return svc.ofBook(bookId);
  }

  // User

  @PostMapping("/book/{bookId}")
  @PreAuthorize("isAuthenticated()")
  public String create(@PathVariable String bookId,
      @RequestBody Review r,
      Authentication a) throws Exception {
    r.setBookId(bookId);
    r.setCreatedBy(a.getName());
    return svc.create(r);
  }

  // Owner or Admin

  @PutMapping("/{id}")
  @PreAuthorize("@reviewAuth.isOwner(#id, authentication.name) or hasRole('ADMIN')")
  public void update(@PathVariable String id,
      @RequestBody Review r,
      Authentication a) throws Exception {
    r.setId(id);
    r.setCreatedBy(a.getName());
    svc.update(r);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("@reviewAuth.isOwner(#id, authentication.name) or hasRole('ADMIN')")
  public void delete(@PathVariable String id) throws Exception {
    svc.delete(id);
  }
}
