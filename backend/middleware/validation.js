const { PASSWORD_MIN_LENGTH, NAME_MAX_LENGTH, EMAIL_MAX_LENGTH } = require('../config/constants');

// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  
  const errors = [];
  
  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.push(`Name must be less than ${NAME_MAX_LENGTH} characters`);
  }
  
  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (email.length > EMAIL_MAX_LENGTH) {
    errors.push(`Email must be less than ${EMAIL_MAX_LENGTH} characters`);
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please provide a valid email address');
  }
  
  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  next();
};

const validateWorkoutCompletion = (req, res, next) => {
  const { levelId, workoutId, exercises, duration } = req.body;
  
  const errors = [];
  
  if (!levelId || typeof levelId !== 'number' || levelId < 1) {
    errors.push('Valid level ID is required');
  }
  
  if (!workoutId || typeof workoutId !== 'string') {
    errors.push('Valid workout ID is required');
  }
  
  if (!Array.isArray(exercises)) {
    errors.push('Exercises must be an array');
  }
  
  if (duration !== undefined && (typeof duration !== 'number' || duration < 0)) {
    errors.push('Duration must be a positive number');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// Rate limiting helper
const createRateLimitMessage = (windowMs, max) => {
  return `Too many requests from this IP, please try again after ${windowMs / 1000} seconds. Limit: ${max} requests per window.`;
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateWorkoutCompletion,
  createRateLimitMessage
};