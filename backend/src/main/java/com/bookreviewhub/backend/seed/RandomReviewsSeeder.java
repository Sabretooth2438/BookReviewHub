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

import java.util.*;

@Configuration
@ConditionalOnProperty(name = "seed", havingValue = "reviews")
@RequiredArgsConstructor
@Slf4j
public class RandomReviewsSeeder {

  private final BookService books;
  private final ReviewService reviews;

  private static final int REVIEWS_PER_BOOK = 3;

  /** comment → rating */
  private static final Map<String, Integer> COMMENT_RATING = Map.ofEntries(
      Map.entry("Five stars!", 5),
      Map.entry("Fantastic read!", 5),
      Map.entry("Loved every chapter.", 5),
      Map.entry("Highly recommended.", 4),
      Map.entry("Great insights.", 4),
      Map.entry("Could be shorter.", 3),
      Map.entry("Meh.", 2),
      Map.entry("Not my cup of tea.", 2),
      Map.entry("Pretty bad.", 1),
      Map.entry("Zero stars.", 0) // ★0
  );
  private static final List<String> COMMENTS = new ArrayList<>(COMMENT_RATING.keySet());

  /* goofy but non-animal handles */
  private static final String[] ADJ = {
      "Funky", "Rusty", "Cosmic", "Witty", "Epic",
      "Turbo", "Electric", "Shadow", "Neon", "Pixel"
  };
  private static final String[] NOUN = {
      "Wizard", "Ninja", "Pirate", "Goblin", "Rocket",
      "Cipher", "Giant", "Phantom", "Cyclone", "Comet"
  };

  private static String randomUsername(Random r) {
    return ADJ[r.nextInt(ADJ.length)] + NOUN[r.nextInt(NOUN.length)];
  }

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

          String comment = COMMENTS.get(rnd.nextInt(COMMENTS.size()));
          int score = COMMENT_RATING.get(comment);

          Review r = new Review(
              UUID.randomUUID().toString(),
              b.getId(),
              comment,
              score,
              "seed@bot", 
              randomUsername(rnd),
              "", 
              false 
          );

          reviews.create(r);
          total++;
        }
      }
      log.info("💬  Seeded {} random reviews.", total);
    };
  }
}
