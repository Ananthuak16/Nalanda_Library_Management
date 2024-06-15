import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoute.js"; 
import adminRoutes from "./routes/adminRoute.js"; 
import bookRoutes from "./routes/bookRoute.js"; 
import borrowingRoutes from "./routes/borrowingRoute.js"; 
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs"
dotenv.config(); // Load environment variables

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Apply cookie-parser middleware


// Parse the Swagger YAML file
const swaggerDocument = YAML.load("./swagger.yaml");

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));




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
