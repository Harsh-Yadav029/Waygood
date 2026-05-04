function errorHandler(error, req, res, next) {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Something went wrong.";
  let details = error.details || undefined;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // Handle Mongoose ValidationError
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(error.errors).map((err) => ({
      field: err.path,
      message: err.message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
}

module.exports = errorHandler;
