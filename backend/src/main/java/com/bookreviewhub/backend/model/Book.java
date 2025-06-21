package com.bookreviewhub.backend.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
  private String id;
  private String title;
  private String author;
  private String description;
  private double rating;
  private String imageUrl;
  private String createdBy;
}
