// Create Token and save in cookie
const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // Options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"? true : false,
  };

  res.status(statusCode)
    .cookie("token", token, options)
    .cookie("role", user.role, options)
    .json({
      success: true,
      token,
      role: user.role,
      message: "Logged in successfully",
    });
};

export default sendToken;
