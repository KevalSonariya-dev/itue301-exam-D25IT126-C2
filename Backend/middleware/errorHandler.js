const errorHandler = (err, req, res, next) => {
  console.error('[Unhandled Error]:', err.message);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);

  // Mongoose validation error handling
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(', ')
    });
  }

  // Mongoose duplicate key error handling
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Resource not found with id of ${err.value}`
    });
  }

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
