// Import necessary module
import mongoose from 'mongoose';

// Define borrowing schema with userId, bookId, borrowedAt, and returnedAt fields
const borrowingSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    },
    bookId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true
    },
    borrowedAt: { 
        type: Date, 
        default: Date.now 
    },
    returnedAt: { 
        type: Date 
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create Borrow model
const Borrow = mongoose.model('Borrow', borrowingSchema);

// Export Borrow model
export default Borrow;
