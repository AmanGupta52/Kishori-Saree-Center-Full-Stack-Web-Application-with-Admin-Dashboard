const { validationResult } = require('express-validator');

/**
 * Runs after an array of express-validator checks and returns a 400
 * with all collected error messages if any check failed.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new Error(message);
  }
  next();
};

module.exports = validate;
