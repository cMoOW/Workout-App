# LevelUpFitness 🏋️‍♀️

A comprehensive fitness tracking app built with React Native and Expo, featuring progressive workout levels, nutrition tracking, and social features. Level up your fitness journey with structured workouts, progress tracking, and community support.

## Features

### **Progressive Workout System**
- **demo of 3 Training Levels**: Foundation, Strength Builder, and Elite Performance
- **Structured Workouts**: Each level contains multiple workout days with specific exercises
- **Exercise Database**: 15+ bodyweight exercises targeting different muscle groups
- **Progress Tracking**: Track completed workouts, streaks, and level progression
- **Unlock System**: Complete workouts to unlock new levels and challenges

###  **Progress & Analytics**
- **Real-time Progress Circles**: Visual representation of your fitness journey
- **Streak Tracking**: Monitor current and longest workout streaks
- **Statistics Dashboard**: View total workouts completed, current level, and achievements
- **Level-based Progression**: Structured advancement through fitness levels

###  **Nutrition Tracking** (Coming Soon)
- **Meal Logging**: Track breakfast, lunch, dinner, and snacks
- **Macro Tracking**: Monitor calories, protein, carbs, and fat intake
- **Water Intake**: Track daily hydration goals
- **Nutrition Goals**: Set personalized dietary targets
- **Barcode Scanning**: Easy food logging with barcode scanning

###  **Social Features**
- **Friend System**: Connect with other fitness enthusiasts
- **Challenges**: Participate in fitness challenges with friends
- **Progress Sharing**: Share achievements and workout completions
- **Community Support**: Get motivated by your fitness community

###  **Modern UI/UX**
- **Beautiful Gradients**: Eye-catching color schemes and animations
- **Responsive Design**: Optimized for both iOS and Android
- **Intuitive Navigation**: Easy-to-use tab-based navigation
- **Progress Visualization**: Clear progress indicators and statistics

##  Tech Stack

### Frontend
- **React Native** with **Expo** for cross-platform mobile development
- **Expo Router** for navigation
- **TypeScript** for type safety
- **React Native Reanimated** for smooth animations
- **AsyncStorage** for local data persistence

### Backend
- **Node.js** with **Express.js** server
- **MongoDB** with **Mongoose** for data persistence
- **JWT Authentication** for secure user sessions
- **Multer** for file uploads (profile images)
- **bcryptjs** for password hashing

### Key Dependencies
- `expo-linear-gradient` - gradient backgrounds
- `react-native-progress` - Progress indicators
- `expo-camera` - Camera functionality
- `expo-image-picker` - Image selection
- `expo-haptics` - Tactile feedback

##  Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **MongoDB** (local installation or MongoDB Atlas)
- **Expo Go app** on your mobile device (for testing)

### Installation

1. **Clone the repository**
   ```bash 
    git clone https://github.com/cMoOW/Workout-App.git
    cd Workout-App```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/levelup_fitness
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=3000
   NODE_ENV=development
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```


6. **Start the Expo development server**
   ```bash
   # From the root directory
   npm start
   ```

7. **Run on your device**
   - Install **Expo Go** on your mobile device
   - Scan the QR code displayed in your terminal
   - The app will load on your device

### Alternative: Run on Simulator

**iOS Simulator:**
```bash
npm run ios
```

**Android Emulator:**
```bash
npm run android
```

**Web Browser:**
```bash
npm run web
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Ready to level up your fitness? Start your journey today! **
