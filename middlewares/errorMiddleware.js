// Middleware for handling 404 errors (resource not found)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`); // Create a new error with a message
    res.status(404); // Set the response status to 404
    next(error); // Pass the error to the next middleware
};

// Middleware for handling general errors
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Set status code to 500 if response status is 200
    let message = err.message || 'Internal Server Error'; // Set error message

    // Specific handling for CastError (invalid ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404; // Set status code to 404
        message = 'Resource not found'; // Set error message
    }

    res.status(statusCode).json({
        message, // Return error message in JSON response
        stack: process.env.NODE_ENV === 'development' ? err.stack : null // Include stack trace in development mode
    });
};

// Export the middleware functions
export { notFound, errorHandler };
