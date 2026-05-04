const HttpError = require("../utils/httpError");

/**
 * Middleware factory to restrict access to specific user roles.
 * Must be used after authMiddleware.
 * 
 * @param {...string} roles - Allowed roles (e.g., 'student', 'counselor')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = requireRole;
