// Configuration constants for the backend
module.exports = {
  // JWT Configuration
  JWT_EXPIRY: '30d',
  
  // Password Security
  BCRYPT_SALT_ROUNDS: 12, // Increased from 10 for better security
  
  // File Upload Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_REQUEST_SIZE: '10mb',
  
  // Workout Configuration
  DEFAULT_EXERCISE_SETS: 3,
  DEFAULT_EXERCISE_REPS: 10,
  
  // Level Progression
  LEVEL_UNLOCK_THRESHOLD: 80, // Percentage required to unlock next level
  
  // Database Configuration
  DB_CONNECTION_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0 // Disable mongoose buffering
  },
  
  // API Configuration
  API_VERSION: 'v1',
  
  // Validation Rules
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255
};