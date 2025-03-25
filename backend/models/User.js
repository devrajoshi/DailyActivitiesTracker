import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Name is required"],
      minlength: [6, "Name should be at least 6 characters"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Exclude password from query results by default
    },
    profilePictureUrl: { type: String }, // Store the profile picture URL
  },
  { timestamps: true } // Automatically manages `createdAt` and `updatedAt`
);

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // Check for a custom flag to bypass hashing
  if (this.skipPasswordHashing) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // No try-catch needed
};

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;
