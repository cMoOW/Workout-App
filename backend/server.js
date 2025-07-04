// server.js - Complete Express + MongoDB Backend for Fitness App
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/levelup_fitness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// =====================================================
// SCHEMAS
// =====================================================

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: null },
  dateJoined: { type: Date, default: Date.now },
  preferences: {
    units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' }
  },
  stats: {
    totalWorkouts: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date, default: null }
  }
});

// Workout Progress Schema
const workoutProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentLevel: { type: Number, default: 1 },
  completedWorkouts: [{
    levelId: Number,
    workoutId: String,
    completedAt: { type: Date, default: Date.now },
    duration: Number, // in minutes
    exercises: [{
      name: String,
      completed: Boolean,
      sets: Number,
      reps: Number,
      weight: Number,
      duration: Number
    }]
  }],
  unlockedLevels: [{ type: Number }],
  achievements: [{
    id: String,
    name: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now },
    icon: String
  }],
  lastSyncedAt: { type: Date, default: Date.now }
});

// Nutrition Log Schema
const nutritionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: [{
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
    foods: [{
      name: String,
      quantity: Number,
      unit: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      fiber: Number
    }],
    totalCalories: Number,
    loggedAt: { type: Date, default: Date.now }
  }],
  dailyGoals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    water: Number // in ml
  },
  waterIntake: { type: Number, default: 0 } // in ml
});

// Social Features Schema
const socialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  friends: [{
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    addedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }
  }],
  challenges: [{
    challengeId: String,
    name: String,
    description: String,
    type: { type: String, enum: ['workout_streak', 'total_workouts', 'minutes_exercised'] },
    target: Number,
    progress: { type: Number, default: 0 },
    startDate: Date,
    endDate: Date,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    completed: { type: Boolean, default: false }
  }],
  posts: [{
    content: String,
    type: { type: String, enum: ['workout_complete', 'achievement', 'progress_update'] },
    data: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }]
});

// Models
const User = mongoose.model('User', userSchema);
const WorkoutProgress = mongoose.model('WorkoutProgress', workoutProgressSchema);
const NutritionLog = mongoose.model('NutritionLog', nutritionLogSchema);
const Social = mongoose.model('Social', socialSchema);

// =====================================================
// MIDDLEWARE
// =====================================================

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// File upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    // Create initial workout progress
    const workoutProgress = new WorkoutProgress({
      userId: user._id,
      unlockedLevels: [1] // Start with level 1 unlocked
    });
    await workoutProgress.save();

    // Create social profile
    const social = new Social({ userId: user._id });
    await social.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          dateJoined: user.dateJoined
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          stats: user.stats
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// =====================================================
// USER PROFILE ROUTES
// =====================================================

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email, preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Upload profile image
app.post('/api/user/profile-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profileImage: imageUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      data: { profileImage: imageUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// =====================================================
// WORKOUT PROGRESS ROUTES
// =====================================================

// Get workout progress
app.get('/api/workout/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await WorkoutProgress.findOne({ userId: req.user.userId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Complete workout
app.post('/api/workout/complete', authenticateToken, async (req, res) => {
  try {
    const { levelId, workoutId, exercises, duration } = req.body;

    const progress = await WorkoutProgress.findOne({ userId: req.user.userId });
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    // Add completed workout
    progress.completedWorkouts.push({
      levelId,
      workoutId,
      exercises,
      duration,
      completedAt: new Date()
    });

    // Update current level if needed
    if (levelId >= progress.currentLevel) {
      progress.currentLevel = levelId;
      
      // Unlock next level
      const nextLevel = levelId + 1;
      if (!progress.unlockedLevels.includes(nextLevel)) {
        progress.unlockedLevels.push(nextLevel);
      }
    }

    progress.lastSyncedAt = new Date();
    await progress.save();

    // Update user stats
    const user = await User.findById(req.user.userId);
    user.stats.totalWorkouts += 1;
    user.stats.totalMinutes += duration;
    user.stats.lastWorkoutDate = new Date();
    
    // Calculate streak
    const today = new Date();
    const lastWorkout = user.stats.lastWorkoutDate;
    if (lastWorkout) {
      const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1) {
        user.stats.currentStreak += 1;
        if (user.stats.currentStreak > user.stats.longestStreak) {
          user.stats.longestStreak = user.stats.currentStreak;
        }
      } else {
        user.stats.currentStreak = 1;
      }
    } else {
      user.stats.currentStreak = 1;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Workout completed successfully',
      data: {
        progress,
        userStats: user.stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// =====================================================
// NUTRITION ROUTES
// =====================================================

// Get nutrition log for date
app.get('/api/nutrition/:date', authenticateToken, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nutritionLog = await NutritionLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999))
      }
    });

    res.json({
      success: true,
      data: nutritionLog || { meals: [], waterIntake: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Log meal
app.post('/api/nutrition/meal', authenticateToken, async (req, res) => {
  try {
    const { date, meal } = req.body;
    
    let nutritionLog = await NutritionLog.findOne({
      userId: req.user.userId,
      date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999)
      }
    });

    if (!nutritionLog) {
      nutritionLog = new NutritionLog({
        userId: req.user.userId,
        date: new Date(date),
        meals: []
      });
    }

    nutritionLog.meals.push(meal);
    await nutritionLog.save();

    res.json({
      success: true,
      message: 'Meal logged successfully',
      data: nutritionLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// =====================================================
// SOCIAL FEATURES ROUTES
// =====================================================

// Get social profile
app.get('/api/social/profile', authenticateToken, async (req, res) => {
  try {
    const social = await Social.findOne({ userId: req.user.userId })
      .populate('friends.friendId', 'name email profileImage stats')
      .populate('challenges.participants', 'name email profileImage');

    res.json({
      success: true,
      data: social || { friends: [], challenges: [], posts: [] }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Send friend request
app.post('/api/social/friend-request', authenticateToken, async (req, res) => {
  try {
    const { friendEmail } = req.body;
    
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (friend._id.toString() === req.user.userId) {
      return res.status(400).json({ success: false, message: 'Cannot add yourself as friend' });
    }

    const social = await Social.findOne({ userId: req.user.userId });
    const friendSocial = await Social.findOne({ userId: friend._id });

    // Check if already friends or request pending
    const existingFriend = social.friends.find(f => f.friendId.toString() === friend._id.toString());
    if (existingFriend) {
      return res.status(400).json({ success: false, message: 'Friend request already sent or user is already a friend' });
    }

    // Add to both users
    social.friends.push({ friendId: friend._id, status: 'pending' });
    friendSocial.friends.push({ friendId: req.user.userId, status: 'pending' });

    await social.save();
    await friendSocial.save();

    res.json({
      success: true,
      message: 'Friend request sent successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Sync data from local storage
app.post('/api/sync', authenticateToken, async (req, res) => {
  try {
    const { workoutProgress, userProfile } = req.body;

    // Update workout progress
    if (workoutProgress) {
      let progress = await WorkoutProgress.findOne({ userId: req.user.userId });
      if (!progress) {
        progress = new WorkoutProgress({ userId: req.user.userId });
      }

      // Merge local data with server data
      progress.currentLevel = Math.max(progress.currentLevel, workoutProgress.currentLevel || 1);
      progress.completedWorkouts = [...progress.completedWorkouts, ...(workoutProgress.completedWorkouts || [])];
      progress.unlockedLevels = [...new Set([...progress.unlockedLevels, ...(workoutProgress.unlockedLevels || [])])];
      progress.lastSyncedAt = new Date();

      await progress.save();
    }

    // Update user profile
    if (userProfile) {
      await User.findByIdAndUpdate(req.user.userId, {
        name: userProfile.name,
        profileImage: userProfile.profileImage,
        stats: userProfile.stats
      });
    }

    // Return updated data
    const updatedProgress = await WorkoutProgress.findOne({ userId: req.user.userId });
    const updatedUser = await User.findById(req.user.userId).select('-password');

    res.json({
      success: true,
      message: 'Data synced successfully',
      data: {
        workoutProgress: updatedProgress,
        userProfile: updatedUser
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sync failed', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Fitness API is running!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Fitness API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});