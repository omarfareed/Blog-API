const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return next(
      new AppError("user must be logged in to access this part", 401)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(new AppError("your account has been deleted", 401));
  req.user = currentUser;
  next();
});
const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    user,
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user?.correctPassword(password, user.password)) {
    return res.status(500).json({
      status: "error",
      message: "wrong email or password",
    });
  }
  user.password = undefined;
  createToken(user, 201, res);
});
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = new User({
    name,
    email,
    password,
  });
  const user = await newUser.save();
  createToken(user, 200, res);
});
