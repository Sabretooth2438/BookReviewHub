package com.bookreviewhub.backend.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {
  private String id;
  private String bookId;
  private String content;
  private double rating;
  private String createdBy;
  private String username;
  private String avatarUrl;
  private boolean anonymous;
}
