import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong MongoDB Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // JWT Expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File is too large. Upload less than 100MB.";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
