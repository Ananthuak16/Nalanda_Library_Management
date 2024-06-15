// Import necessary module
import mongoose from 'mongoose';

// Define book schema with fields for title, author, ISBN, publicationDate, genre, and copies
const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    author: {
        type: String,
        required: true 
    },
    ISBN: {
        type: String,
        required: true 
    },
    publicationDate: {
        type: Date,
        required: true 
    },
    genre: {
        type: String,
        required: true 
    },
    copies: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create Book model
const Book = mongoose.model('Book', bookSchema);

// Export Book model
export default Book;
