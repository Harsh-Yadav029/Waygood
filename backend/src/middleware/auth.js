const jwt = require("jsonwebtoken");

const env = require("../config/env");
const Student = require("../models/Student");
const asyncHandler = require("../utils/asyncHandler");
const HttpError = require("../utils/httpError");

const requireAuth = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization token missing.");
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const student = await Student.findById(decoded.sub).select("-password");

    if (!student) {
      throw new HttpError(401, "We couldn't find an account for this session. Please sign in again.");
    }

    req.user = student;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new HttpError(401, "Your session has expired. Please log in again to continue.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new HttpError(401, "Authentication failed. Please sign in again.");
    }
    throw new HttpError(401, "An authentication error occurred. Please try logging in again.");
  }
});

module.exports = {
  requireAuth,
};
