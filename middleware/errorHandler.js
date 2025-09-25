const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // MySQL errors
  if (err.code) {
    switch (err.code) {
      case 'ER_DUP_ENTRY':
        error = {
          message: 'Duplicate entry. Record already exists.',
          statusCode: 409
        };
        break;
      case 'ER_NO_REFERENCED_ROW_2':
        error = {
          message: 'Referenced record does not exist.',
          statusCode: 400
        };
        break;
      case 'ER_ROW_IS_REFERENCED_2':
        error = {
          message: 'Cannot delete record. It is referenced by other records.',
          statusCode: 400
        };
        break;
      case 'ER_BAD_FIELD_ERROR':
        error = {
          message: 'Invalid field in query.',
          statusCode: 400
        };
        break;
      case 'ER_PARSE_ERROR':
        error = {
          message: 'SQL syntax error.',
          statusCode: 400
        };
        break;
      case 'ECONNREFUSED':
        error = {
          message: 'Database connection refused.',
          statusCode: 500
        };
        break;
      default:
        error = {
          message: 'Database error occurred.',
          statusCode: 500
        };
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      message: 'Invalid token.',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      message: 'Token expired.',
      statusCode: 401
    };
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      message: 'File size too large.',
      statusCode: 400
    };
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = {
      message: 'Unexpected file field.',
      statusCode: 400
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;