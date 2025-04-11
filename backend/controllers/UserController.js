import User from "../models/User.js";
import bcrypt from "bcryptjs";
import ApiError from "../utils/ApiError.js"; // Custom error handler
import ApiResponse from "../utils/ApiResponse.js"; // Custom success response

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({
      created_at: -1,
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/me - Fetch the authenticated user's details
const getSpecificUser = async (req, res) => {
  try {
    // The user object is already attached to the request by the protect middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User details:", user); // Debugging line to check user details
    // Send the user details as a response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user details" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming auth middleware sets req.user
    const { fullname, username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullname, username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password and bypass the pre-save middleware
    user.password = newHashedPassword;
    user.skipPasswordHashing = true; // Bypass hashing in middleware
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
      requireReLogin: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      fullname,
      username,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ email }).select("+password"); // Include password field
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // Skip validation to avoid re-hashing the password

    // Set cookies with HttpOnly and Secure flags
    const options = {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevent CSRF attacks
    };

    // Send tokens in cookies
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: {
              _id: user._id,
              username: user.username,
              email: user.email,
              profilePictureUrl: user.profilePictureUrl,
            },
          },
          "Login successful"
        )
      );
  } catch (error) {
    console.error("Login error:", error);
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Server error"
    );
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
};

export {
  getUsers,
  getSpecificUser,
  updateProfile,
  changePassword,
  registerUser,
  loginUser,
  logoutUser,
};
