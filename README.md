## Nalanda Library Management System

### Introduction
Welcome to the Nalanda Library Management System! This project aims to provide a comprehensive backend system for managing a library, including user management, book management, borrowing system, and reporting functionalities.

### Tech Stack
- Node.js
- Express
- MongoDB
- AWS (optional)

### Setup Instructions
1. **Clone Repository**: Clone this repository to your local machine using the following command:
   ```
   git clone <[repository-url](https://github.com/Ananthuak16/Nalanda_Library_Management.git)>
   ```
2. **Install Dependencies**: Navigate to the project directory and install the dependencies using npm or yarn:
   ```
   npm install
   ```

3. **Environment Variables**: Create a `.env` file in the root directory and define the following environment variables:
   ```
   PORT=<port-number>
   MONGODB_URI=<mongodb-uri>
   JWT_SECRET=<jwt-secret>
   ```
4. **Run the Server**: Start the server by running the following command:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

### API Documentation
#### User Management
- **User Registration**
  - Endpoint: `POST /api/users/`
  - Description: Register a new user with name, email, and password.

- **User Login**
  - Endpoint: `POST /api/users/auth`
  - Description: Authenticate user with email and password.

#### Book Management
- **Add Book**
  - Endpoint: `POST /api/books/add`
  - Description: Add a new book with details like title, author, ISBN, publication date, genre, and number of copies.

- **Update Book**
  - Endpoint: `PUT /api/books/update/:id`
  - Description: Update details of an existing book.

- **Delete Book**
  - Endpoint: `DELETE /api/books/delete/:id`
  - Description: Delete a book from the library.

- **List Books**
  - Endpoint: `GET /api/books/list`
  - Description: Get a paginated list of books with filtering options by genre, author, etc.

#### Borrowing System
- **Borrow Book**
  - Endpoint: `POST /api/borrow/borrow`
  - Description: Allow members to borrow a book if available.

- **Return Book**
  - Endpoint: `POST /api/borrow/return`
  - Description: Allow members to return a borrowed book.

- **Borrow History**
  - Endpoint: `GET /api/borrow/history/:userId`
  - Description: Get borrowing history for a specific user.

#### Reports and Aggregations
- **Most Borrowed Books**
  - Endpoint: `GET /api/borrow/mostBorrowed`
  - Description: Generate a report of the most borrowed books.

- **Active Members**
  - Endpoint: `GET /api/borrow/mostActive`
  - Description: List the most active members based on borrowing history.

- **Book Availability**
  - Endpoint: `GET /api/borrow/bookAvailability`
  - Description: Provide a summary report of book availability.
 
  - 
## AWS Deployment
 
The application is deployed and can be accessed [here](http://43.205.242.121:3200/).




