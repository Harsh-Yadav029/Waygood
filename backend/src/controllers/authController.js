const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

/**
 * Generate a JWT for a user
 * @param {string} id - User ID
 */
const generateToken = (id) => {
  return jwt.sign({ sub: id }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  const existingUser = await Student.findOne({ email });
  if (existingUser) {
    throw new HttpError(409, "User with this email already exists");
  }

  const user = await Student.create({
    fullName,
    email,
    password,
    role: role || "student",
  });

  // Exclude password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: `Welcome to Waygood, ${user.fullName}! Your account has been created successfully.`,
    data: {
      user: userResponse,
      token: generateToken(user._id),
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await Student.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new HttpError(401, "The email or password you entered is incorrect. Please try again.");
  }

  // Exclude password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    message: `Welcome back, ${user.fullName}! We're glad to see you again.`,
    data: {
      user: userResponse,
      token: generateToken(user._id),
    },
  });
});

const me = asyncHandler(async (req, res) => {
  // req.user is already populated by authMiddleware
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  register,
  login,
  me,
};
