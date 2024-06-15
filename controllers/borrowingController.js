// Import necessary modules
import asyncHandler from "express-async-handler";
import Borrow from "../models/borrowingModel.js";
import Book from "../models/bookModel.js";

// @desc Borrow a book
// @route POST /api/borrows
// @access Public
const BorrowBook = asyncHandler(async (req, res) => {
    const { userId, bookId } = req.body;
    const book = await Book.findOne({ _id: bookId, copies: { $gt: 0 } });
    
    if (!book) {
        res.status(400);
        throw new Error("Book out of stock");
    }

    const borrow = await Borrow.create({ userId, bookId });

    await Book.updateOne({ _id: bookId }, { $inc: { copies: -1 } });

    if (borrow) {
        res.status(201).json({
            _id: borrow._id,
            userId: borrow.userId,
            bookId: borrow.bookId,
            borrowedAt: borrow.borrowedAt,
        });
    } else {
        res.status(400);
        throw new Error("Invalid user or book");
    }
});

// @desc Return a borrowed book
// @route POST /api/borrows/return
// @access Public
const returnBook = asyncHandler(async (req, res) => {
    const borrow = await Borrow.findById(req.body.borrowId);

    if (borrow) {
        borrow.returnedAt = Date.now();
        const returnBook = await borrow.save();
        await Book.updateOne({ _id: borrow.bookId }, { $inc: { copies: 1 } });

        res.status(200).json({  
            _id: returnBook._id,
            userId: returnBook.userId,
            bookId: returnBook.bookId,
            borrowedAt: returnBook.borrowedAt,
            returnedAt: returnBook.returnedAt
        });
    } else {
        res.status(404);
        throw new Error('Borrow record not found');
    }
});

// @desc Get borrow history for a user
// @route GET /api/borrows/history/:userId
// @access Public
const borrowHistory = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const borrow = await Borrow.find({ userId }).populate('bookId');
        res.status(201).json({ borrow });
    } catch (error) {
        res.status(404).json({ message: "List History Failed", task: false });
    }
});

// @desc Get most borrowed books
// @route GET /api/borrows/most-borrowed
// @access Public
const mostBorrowedBooks = asyncHandler(async (req, res) => {
    try {
        const mostBorrowed = await Borrow.aggregate([
            {
                $group: { _id: "$bookId", borrowCount: { $sum: 1 } }
            },
            {
                $sort: { borrowCount: -1 }
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookDetails"
                }
            },
            {
                $unwind: "$bookDetails"
            },
            {
                $project: {
                    _id: 0,
                    bookId: "$_id",
                    title: "$bookDetails.title",
                    author: "$bookDetails.author",
                    borrowCount: 1
                }
            }
        ]);

        res.status(200).json(mostBorrowed);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate report", error: error.message });
    }
});

// @desc Get most active members
// @route GET /api/borrows/most-active
// @access Public
const mostActiveMembers = asyncHandler(async (req, res) => {
    try {
        const activeMembers = await Borrow.aggregate([
            {
                $group: { _id: "$userId", borrowCount: { $sum: 1 } }
            },
            {
                $sort: { borrowCount: -1 }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$_id",
                    name: "$userDetails.name",
                    email: "$userDetails.email",
                    borrowCount: 1
                }
            }
        ]);

        res.status(200).json(activeMembers);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate report", error: error.message });
    }
});

// @desc Get book availability
// @route GET /api/books/availability
// @access Public
const bookAvailability = asyncHandler(async (req, res) => {
    try {
        const books = await Book.aggregate([
            {
                $lookup: {
                    from: "borrows",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "borrowedBooks"
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    totalBooks: { $add: ["$copies", { $size: "$borrowedBooks" }] },
                    totalBorrowedBooks: { $size: "$borrowedBooks" },            
                    totalAvailableBooks: {
                        $subtract: [
                            { $add: ["$copies", { $size: "$borrowedBooks" }] },
                            { $size: "$borrowedBooks" }
                        ]
                    }
                }
            }
        ]);

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate report", error: error.message });
    }
});

// Export the functions
export {
    BorrowBook,
    returnBook,
    borrowHistory,
    mostBorrowedBooks,
    mostActiveMembers,
    bookAvailability
};
