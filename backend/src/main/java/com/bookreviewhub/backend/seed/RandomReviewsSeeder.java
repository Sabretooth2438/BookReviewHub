package com.bookreviewhub.backend.seed;

import com.bookreviewhub.backend.model.Review;
import com.bookreviewhub.backend.service.BookService;
import com.bookreviewhub.backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;
import java.util.UUID;

@Configuration
@ConditionalOnProperty(name = "seed", havingValue = "reviews")
@RequiredArgsConstructor
@Slf4j
public class RandomReviewsSeeder {

  private final BookService books;
  private final ReviewService reviews;

  private static final int REVIEWS_PER_BOOK = 3;
  private static final String[] COMMENTS = {
      "Fantastic read!", "Highly recommended.", "Meh.",
      "Loved every chapter.", "Not my cup of tea.",
      "Great insights.", "Could be shorter.", "Five stars!"
  };

  @Bean
  ApplicationRunner run() {
    return args -> {
      if (reviews.hasAnyReview()) {
        log.info("💬  Review seeding skipped – collection already populated.");
        return;
      }

      Random rnd = new Random();
      int total = 0;

      for (var b : books.all()) {
        for (int i = 0; i < REVIEWS_PER_BOOK; i++) {
          Review r = new Review(
              UUID.randomUUID().toString(),
              b.getId(),
              COMMENTS[rnd.nextInt(COMMENTS.length)],
              rnd.nextInt(6),
              "seed@bot",
              "Seed Bot",
              "",
              false);

          reviews.create(r);
          total++;
        }
      }
      log.info("💬  Seeded {} random reviews.", total);
    };
  }
}
