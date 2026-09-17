const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

// Human-readable labels for the field names that show up in Mongoose/Mongo
// errors, so messages read like "Category" instead of "category".
const FIELD_LABELS = {
  category: 'Category',
  fabric: 'Fabric',
  colors: 'Color',
  occasions: 'Occasion',
  sku: 'SKU',
  email: 'Email',
  name: 'Name',
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server Error';

  // Mongoose/BSON cast error - in this app this almost always means a form
  // field held an empty string or malformed id where an ObjectId (or other
  // typed value) was expected. That's bad input, not a missing resource, so
  // this is a 400, and the message names the actual field rather than
  // exposing the raw "Cast to ObjectId failed ... BSONError" internals.
  if (err.name === 'CastError') {
    statusCode = 400;
    const label = FIELD_LABELS[err.path] || err.path || 'a field';
    message =
      err.kind === 'ObjectId'
        ? `Invalid selection for "${label}". Please choose a valid option and try again.`
        : `Invalid value provided for "${label}".`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Mongoose duplicate key (unique index collision)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    const label = FIELD_LABELS[field] || field;
    message = `This ${label} is already in use. Please use a different value.`;
  }

  // Multer errors (file too large, too many files, disallowed type)
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'One of the images is too large. Please upload files under 10MB.';
    } else if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Too many images selected. You can upload up to 8 images per saree.';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };