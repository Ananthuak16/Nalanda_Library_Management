// Import necessary modules
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define user schema with name, email, password, and role fields
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
}, { timestamps: true });

// Middleware to hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {  
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create User model
const User = mongoose.model('User', userSchema);

// Export User model
export default User;
