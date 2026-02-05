import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/User.js";
import sendToken from "../utils/jwtToken.js";
import crypto from "crypto";

// Note: Google Auth Library is no longer needed as we decode the Google token on the frontend
// and send user data directly to the backend

// Register User
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: role ? role : "user",
    profileImageURL: req.body.profileImageURL || "",
    authProviders: ["email_password"],
    hasLocalPassword: true,
  });

  sendToken(user, 201, res);
});

// Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password hasLocalPassword authProviders email role");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!user.hasLocalPassword || !user.password) {
    return next(new ErrorHandler("This account uses a different sign-in method", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Google Login - Receives user data from frontend (already decoded by Google SDK)
// This approach trusts the frontend to send valid Google user data
// and generates our own JWT token for session management
export const googleLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, name, picture, googleId } = req.body;

  // Validate required fields
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  if (!name) {
    return next(new ErrorHandler("Name is required", 400));
  }

  try {
    let user = await User.findOne({ email }).select("+password");

    const ensureGoogleProvider = (u) => {
      if (!u.authProviders) u.authProviders = [];
      if (!u.authProviders.includes("google")) {
        u.authProviders.push("google");
      }
    };

    if (user) {
      // User exists - update with Google info
      if (!user.password) {
        user.password = crypto.randomBytes(32).toString("hex");
        user.hasLocalPassword = false;
      }
      ensureGoogleProvider(user);
      
      // Update profile image if not set or is default
      if (!user.profileImageURL || user.profileImageURL === 'https://pub-24b8c8616a6f471d969d69ad72773583.r2.dev/profile.jpg') {
        user.profileImageURL = picture || user.profileImageURL;
      }
      
      // Store Google ID if provided
      if (googleId && !user.googleId) {
        user.googleId = googleId;
      }
      
      await user.save();
      sendToken(user, 200, res);
    } else {
      // Create new user with Google
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(32).toString("hex"),
        profileImageURL: picture || 'https://pub-24b8c8616a6f471d969d69ad72773583.r2.dev/profile.jpg',
        role: "user",
        authProviders: ["google"],
        hasLocalPassword: false,
        googleId: googleId || undefined,
      });

      sendToken(user, 201, res);
    }
  } catch (error) {
    console.error('Google login error:', error);
    return next(new ErrorHandler("Google login failed", 500));
  }
});

// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("role", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

// Get User Profile
export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Get User Details (same as profile but named differently)
export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Profile
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    profileImageURL: req.body.profileImageURL,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Update Password
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// Forgot Password
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get("host")}/api/users/password/reset/${resetToken}`;
  const message = `Your password reset token is:\n\n${resetUrl}\n\nIf you have not requested this email then, please ignore it.`;

  try {
    // You can add email sending logic here similar to Kailainathar project
    res.status(200).json({
      success: true,
      message: `Password reset link: ${resetUrl}`,
      resetToken, // For development purposes
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.hasLocalPassword = true;

  await user.save();

  sendToken(user, 200, res);
});

// Admin: Get All Users
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Admin: Get Single User
export const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin: Update User Role
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Admin: Delete User
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});