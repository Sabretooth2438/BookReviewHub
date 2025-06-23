# BookReviewHub

BookReviewHub is a full-stack web application for browsing books and sharing reviews. The backend is built with **Spring Boot** and the frontend uses **React** with **Tailwind CSS**.

## Features
- User registration and authentication
- Browse and search a catalog of books
- Write, edit and delete reviews
- User profiles with display name and avatar
- Admin dashboard for managing books and reviews

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org)
- Java 17+ and [Maven](https://maven.apache.org)

### Installation
1. Clone the repository.
2. Install front-end dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the backend server:
   ```bash
   cd ../backend
   ./mvnw spring-boot:run
   ```
4. In another terminal, start the React development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

You can also run both servers together from the project root with:
```bash
npm run dev
```

## Screenshots
Place screenshots of the website in this section.

![Homepage](./path/to/homepage.png)
![Book page](./path/to/book-page.png)

## Pseudocode

```plaintext
IF user submits review
    FETCH book by ID
    ADD review to book.reviews
    RECALCULATE book rating
    UPDATE book
END IF
```

## Entity-Relationship Diagram (ERD)

The application is centred around three main entities: **User**, **Book**, and **Review**.

![ERD Diagram Placeholder](./path/to/erd-image.png)

- **User** has many **Reviews**
- **Book** has many **Reviews**
- **Review** belongs to both **User** and **Book**

## User Stories

- **[US1]** _As a visitor, I can sign up with a username and profile picture so that others can recognise me._
- **[US2]** _As a reader, I want to browse books and see their ratings so that I can choose what to read._
- **[US3]** _As a logged-in user, I can post reviews anonymously or with my profile._
- **[US4]** _As an admin, I can manage books and moderate reviews._

## Maintainer
This project is maintained by [**Sabretooth2438**](https://github.com/Sabretooth2438).

<img src="https://github.com/Sabretooth2438.png" width="100" alt="Sabretooth2438 avatar" />

---

Feel free to open issues or submit pull requests to contribute.
