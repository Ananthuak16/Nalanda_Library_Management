// Import necessary modules
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../Utils/generateToken.js";

// @Authenticate user and set token
// @route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id); // Generate token and set it in response cookies
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error('Invalid email or password'); // Throw error if credentials are invalid
    }
});

// @Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
        res.status(400);
        throw new Error("User already exists"); // Throw error if user already exists
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        generateToken(res, user._id); // Generate token and set it in response cookies
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data"); // Throw error if user data is invalid
    }
});

// @Logout user
// @route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(0) // Set cookie expiration to past date to remove it
    });
    res.status(200).json({ message: "User logged out" });
});

// Export the functions
export {
    authUser,
    registerUser,
    logoutUser,
};
