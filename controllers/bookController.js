// Import necessary modules
import asyncHandler from "express-async-handler";
import Book from "../models/bookModel.js";

// @Add a new book
// @route POST /api/books
// @access Public
const addNewBook = asyncHandler(async (req, res) => {
    const { title, author, ISBN, publicationDate, genre, copies } = req.body;
    const bookExist = await Book.findOne({ ISBN });

    if (bookExist) {
        res.status(400);
        throw new Error("Book already exists");
    }

    const book = await Book.create({
        title,
        author,
        ISBN,
        publicationDate,
        genre,
        copies
    });

    if (book) {
        res.status(201).json({
            _id: book._id,
            title: book.title,
            author: book.author,
            ISBN: book.ISBN,
            publicationDate: book.publicationDate,
            genre: book.genre,
            copies: book.copies,
        });
    } else {
        res.status(400);
        throw new Error("Invalid book data");
    }
});

// @Update an existing book
// @route PUT /api/books/:id
// @access Public
const updateBook = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.body._id);

    if (book) {
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.ISBN = req.body.ISBN || book.ISBN;
        book.publicationDate = req.body.publicationDate || book.publicationDate;
        book.genre = req.body.genre || book.genre;
        book.copies = req.body.copies || book.copies;

        const updatedBook = await book.save();
        res.status(200).json({
            _id: updatedBook._id,
            title: updatedBook.title,
            author: updatedBook.author,
            ISBN: updatedBook.ISBN,
            publicationDate: updatedBook.publicationDate,
            genre: updatedBook.genre,
            copies: updatedBook.copies,
        });
    } else {
        res.status(404);
        throw new Error('Book not found');
    }
});

// @Delete a book
// @route DELETE /api/books/:id
// @access Public
const deleteBook = asyncHandler(async (req, res) => {
    try {
        await Book.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Book deleted successfully", task: true });
    } catch (error) {
        res.status(404).json({ message: "Book deletion failed", task: false });
    }
});

// @List books with pagination and filtering
// @route GET /api/books
// @access Public
const listBooks = asyncHandler(async (req, res) => {
    let query = {}; // Initialize query object

    // Pagination parameters
    const page = parseInt(req.query.page) || 1; // Get page number from query parameter, default to 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Get page size from query parameter, default to 10 if not provided
    const skip = (page - 1) * pageSize; // Calculate number of documents to skip

    // Filtering options
    if (req.query.genre) {
        query.genre = req.query.genre; // Filter by genre
    }
    if (req.query.author) {
        query.author = req.query.author; // Filter by author
    }

    const totalBooks = await Book.countDocuments(query); // Get total number of books based on the query
    const totalPages = Math.ceil(totalBooks / pageSize); // Calculate total number of pages

    const books = await Book.find(query)
        .skip(skip)
        .limit(pageSize); // Fetch books for the current page and filter by query options

    res.status(200).json({
        books,
        page,
        pageSize,
        totalPages,
        totalBooks
    });
});

// Export the functions
export {
    addNewBook,
    updateBook,
    deleteBook,
    listBooks
};
