// Import necessary modules
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../Utils/generateToken.js";

// @desc Auth admin/set token
// @route POST /api/admin/auth
// @access Public
const authAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;  // Extract email and password from request body

    // Find user with email and role as Admin
    const admin = await User.findOne({ email, role: "Admin" });

    // If admin exists and password matches
    if (admin && (await admin.matchPassword(password))) {
        generateToken(res, admin._id);  // Generate token
        res.status(201).json({  // Send response with admin details
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } else {
        res.status(400);  // Send error response if authentication fails
        throw new Error('Invalid email or password');
    }
});

// @desc Logout admin
// @route POST /api/admin/logout
// @access Public
const logoutAdmin = asyncHandler(async (req, res) => {
    // Clear JWT cookie
    res.cookie('jwt', "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Admin logged out" });  // Send success response
});

// Export the functions
export {
    authAdmin,
    logoutAdmin,
};
