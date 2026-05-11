import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Database errors
  if (err.code === '23505') {
    return res.status(409).json({ message: 'Record already exists' });
  }

  if (err.code === '23503') {
    return res.status(400).json({ message: 'Invalid foreign key reference' });
  }

  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation error',
      details: err.details.map((d) => ({
        field: d.context.key,
        message: d.message,
      })),
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
