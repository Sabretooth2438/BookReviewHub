package com.bookreviewhub.backend.service;

import com.bookreviewhub.backend.model.Book;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class BookService {

  private final ReviewService reviews;

  private static final String COL = "books";

  private Firestore db() {
    return FirestoreClient.getFirestore();
  }

  // Queries

  public List<Book> all() {
    try {
      return db().collection(COL).get().get().toObjects(Book.class);
    } catch (InterruptedException | ExecutionException e) {
      return Collections.emptyList();
    }
  }

  public Book one(String id) throws Exception {
    DocumentSnapshot snap = db().collection(COL).document(id).get().get();
    if (!snap.exists())
      throw new Exception("Not found");
    return snap.toObject(Book.class);
  }

  // CRUD operations

  public String create(Book b) throws Exception {
    DocumentReference ref = db().collection(COL).document();
    b.setId(ref.getId());
    ref.set(b).get();
    return b.getId();
  }

  public void update(Book b) throws Exception {
    db().collection(COL).document(b.getId()).set(b).get();
  }

  public void delete(String id) throws Exception {
    reviews.deleteAllOfBook(id);
    db().collection(COL).document(id).delete().get();
  }
}
