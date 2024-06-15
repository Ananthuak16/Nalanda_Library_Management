import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js"; 
import adminRoutes from "./routes/adminRoute.js"; 
import bookRoutes from "./routes/bookRoute.js"; 
import borrowingRoutes from "./routes/borrowingRoute.js"; 

dotenv.config(); // Load environment variables

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Apply cookie-parser middleware

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowingRoutes);

// Root route
app.get('/', (req, res) => res.send('Server is running'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}`));
