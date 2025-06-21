package com.bookreviewhub.backend.controller;

import com.bookreviewhub.backend.model.Book;
import com.bookreviewhub.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

  private final BookService svc;

  // Public

  @GetMapping
  public List<Book> all() {
    return svc.all();
  }

  // Admin

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public String create(@RequestBody Book book, Authentication auth) throws Exception {
    book.setCreatedBy(auth.getName());
    return svc.create(book);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public void update(@PathVariable String id,
      @RequestBody Book book,
      Authentication auth) throws Exception {
    book.setId(id);
    book.setCreatedBy(auth.getName());
    svc.update(book);
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public void delete(@PathVariable String id) throws Exception {
    svc.delete(id);
  }
}
