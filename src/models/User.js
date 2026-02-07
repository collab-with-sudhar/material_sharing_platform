import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should have more than 2 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: false,
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  profileImageURL: {
    type: String,
    default: 'https://pub-24b8c8616a6f471d969d69ad72773583.r2.dev/profile.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  totalUploads: {
    type: Number,
    default: 0,
  },
  savedMaterials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyMaterial'
  }],
  authProviders: {
    type: [String],
    enum: ["email_password", "google"],
    default: ["email_password"],
  },
  hasLocalPassword: {
    type: Boolean,
    default: true,
  },
  googleId: {
    type: String,
    sparse: true,
    index: true,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// JWT Token generation
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  return resetToken;
};

export default mongoose.model('User', userSchema);