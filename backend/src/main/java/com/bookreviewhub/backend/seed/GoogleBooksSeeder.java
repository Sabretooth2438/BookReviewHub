package com.bookreviewhub.backend.seed;

import com.bookreviewhub.backend.model.Book;
import com.bookreviewhub.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Configuration
@ConditionalOnProperty(name = "seed", havingValue = "books")
@RequiredArgsConstructor
@Slf4j
public class GoogleBooksSeeder {

  private final BookService books;

  private static final List<String> QUERIES = List.of(
      "clean code", "design patterns", "spring boot");

  private static final int MAX_RESULTS_PER_QUERY = 10;
  private static final int MAX_TOTAL_BOOKS = 30;

  @Bean
  ApplicationRunner run() {
    return args -> {
      if (!books.all().isEmpty()) {
        log.info("🔥  Seed skipped – books collection already populated.");
        return;
      }

      RestTemplate rt = new RestTemplate();
      int imported = 0;

      outer: for (String q : QUERIES) {
        String url = "https://www.googleapis.com/books/v1/volumes?q="
            + URLEncoder.encode(q, StandardCharsets.UTF_8)
            + "&printType=books&maxResults=" + MAX_RESULTS_PER_QUERY;

        var res = rt.exchange(url, HttpMethod.GET,
            new HttpEntity<>(new HttpHeaders()), GoogleResult.class);

        if (res.getBody() == null || res.getBody().items() == null)
          continue;

        for (Item it : res.getBody().items()) {
          if (imported >= MAX_TOTAL_BOOKS)
            break outer;

          Info v = it.volumeInfo();
          String title = v.title();

          boolean exists = books.all().stream()
              .anyMatch(b -> b.getTitle().equalsIgnoreCase(title));
          if (exists)
            continue;

          Book b = new Book(
              null,
              title,
              v.authors() == null ? "Unknown" : String.join(", ", v.authors()),
              Objects.requireNonNullElse(v.description(), ""),
              v.averageRating() == null ? 0.0 : v.averageRating(),
              v.imageLinks() == null ? null : v.imageLinks().thumbnail(),
              "seed");

          books.create(b);
          imported++;
        }
      }
      log.info("📚  Seeded {} books from Google Books API.", imported);
    };
  }

  // JSON Mappers
  private record GoogleResult(Item[] items) {
  }

  private record Item(Info volumeInfo) {
  }

  private record Info(
      String title, List<String> authors, String description,
      Double averageRating, ImageLinks imageLinks) {
  }

  private record ImageLinks(String thumbnail, String smallThumbnail) {
  }
}
