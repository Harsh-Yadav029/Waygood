const { validationResult } = require("express-validator");
const HttpError = require("../utils/httpError");

/**
 * Generic validation middleware that runs express-validator rules
 * and returns a 400 error if validation fails.
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorDetails = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorDetails,
    });
  };
};

module.exports = validate;
