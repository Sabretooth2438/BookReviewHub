package com.bookreviewhub.backend.service;

import com.bookreviewhub.backend.model.Book;
import com.bookreviewhub.backend.model.Review;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ReviewService {

  private static final String COL_REVIEWS = "reviews";
  private static final String COL_BOOKS = "books";

  private Firestore db() {
    return FirestoreClient.getFirestore();
  }

  // Queries

  public List<Review> ofBook(String bookId) {
    try {
      return db().collection(COL_REVIEWS)
          .whereEqualTo("bookId", bookId)
          .get().get()
          .toObjects(Review.class);
    } catch (InterruptedException | ExecutionException e) {
      Thread.currentThread().interrupt();
      return Collections.emptyList();
    }
  }

  public Review findById(String id) {
    try {
      DocumentSnapshot s = db().collection(COL_REVIEWS).document(id).get().get();
      return s.exists() ? s.toObject(Review.class) : null;
    } catch (InterruptedException | ExecutionException e) {
      Thread.currentThread().interrupt();
      return null;
    }
  }

  public boolean hasAnyReview() {
    try {
      return !db().collection(COL_REVIEWS).limit(1).get().get().isEmpty();
    } catch (InterruptedException | ExecutionException e) {
      Thread.currentThread().interrupt();
      return false;
    }
  }

  // Updated CRUD operations

  public Book create(Review r) throws Exception {
    DocumentReference ref = db().collection(COL_REVIEWS).document();
    r.setId(ref.getId());
    ref.set(r).get();
    return refreshRating(r.getBookId());
  }

  public Book update(Review r) throws Exception {
    db().collection(COL_REVIEWS).document(r.getId()).set(r).get();
    return refreshRating(r.getBookId());
  }

  public void delete(String id) throws Exception {
    Review existing = findById(id);
    if (existing == null)
      return;

    db().collection(COL_REVIEWS).document(id).delete().get();
    refreshRating(existing.getBookId());
  }

  public void deleteAllOfBook(String bookId)
      throws ExecutionException, InterruptedException {

    List<QueryDocumentSnapshot> docs = db().collection(COL_REVIEWS)
        .whereEqualTo("bookId", bookId)
        .get().get().getDocuments();

    if (docs.isEmpty())
      return;

    int batchSize = 450;
    WriteBatch batch = db().batch();
    int count = 0;

    for (DocumentSnapshot d : docs) {
      batch.delete(d.getReference());
      if (++count == batchSize) {
        batch.commit().get();
        batch = db().batch();
        count = 0;
      }
    }
    batch.commit().get();
  }

  private Book refreshRating(String bookId) {
    List<Review> reviews = ofBook(bookId);

    double avg = reviews.isEmpty()
        ? 0.0
        : reviews.stream()
            .collect(Collectors.averagingDouble(Review::getRating));

    try {
      DocumentReference bookRef = db().collection(COL_BOOKS).document(bookId);
      bookRef.update("rating", avg).get();

      DocumentSnapshot snapshot = bookRef.get().get();
      return snapshot.toObject(Book.class);
    } catch (InterruptedException | ExecutionException e) {
      System.err.println("Could not refresh rating for book " + bookId + ": " + e.getMessage());
      Thread.currentThread().interrupt();
      return null;
    }
  }
}
