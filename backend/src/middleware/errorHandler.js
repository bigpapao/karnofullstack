import { ApiError } from '../utils/api-error.js';
import { logger } from '../utils/logger.js';

/**
 * Global error handling middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`);
  logger.error(err.stack);

  // Handle different types of errors
  if (err instanceof ApiError) {
    // Handle known API errors
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code
    });
  }

  if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'JsonWebTokenError') {
    // Handle JWT errors
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    // Handle expired JWT tokens
    return res.status(401).json({
      status: 'error',
      message: 'Token expired'
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate field value entered'
    });
  }

  // Default error
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};

/**
 * Not found middleware
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Async handler wrapper to catch async errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}; 