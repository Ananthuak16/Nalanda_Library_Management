// Import necessary modules
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Middleware to protect routes and ensure the user is authenticated
const protect = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt; // Get JWT token from cookies

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
            req.user = await User.findById(decoded.user).select('-password'); // Get user from database and exclude password
            next(); // Proceed to the next middleware
        } catch (error) {
            res.status(401); // Set response status to 401 (Unauthorized)
            throw new Error('Not authorized, Invalid token'); // Throw an error if token is invalid
        }
    } else {
        res.status(401); // Set response status to 401 (Unauthorized)
        throw new Error('Not authorized, No token'); // Throw an error if no token is found
    }
});

// Middleware to ensure the user has admin privileges
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') { // Check if user is an admin
        next(); // Proceed to the next middleware
    } else {
        res.status(403); // Set response status to 403 (Forbidden)
        throw new Error('Not authorized as an admin'); // Throw an error if user is not an admin
    }
};

// Export the middleware functions
export { protect, admin };
