/**
 * Centralized logging utility
 * Provides different log levels and can be easily disabled for production
 */

const IS_DEV = __DEV__; // React Native development flag

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private currentLevel: LogLevel = IS_DEV ? LogLevel.DEBUG : LogLevel.ERROR;

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  debug(message: string, data?: any) {
    if (this.currentLevel <= LogLevel.DEBUG) {
      console.log(`🔍 [DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any) {
    if (this.currentLevel <= LogLevel.INFO) {
      console.log(`ℹ️ [INFO] ${message}`, data || '');
    }
  }

  warn(message: string, data?: any) {
    if (this.currentLevel <= LogLevel.WARN) {
      console.warn(`⚠️ [WARN] ${message}`, data || '');
    }
  }

  error(message: string, error?: any) {
    if (this.currentLevel <= LogLevel.ERROR) {
      console.error(`❌ [ERROR] ${message}`, error || '');
    }
  }

  workout(message: string, data?: any) {
    if (IS_DEV) {
      console.log(`💪 [WORKOUT] ${message}`, data || '');
    }
  }

  progress(message: string, data?: any) {
    if (IS_DEV) {
      console.log(`📊 [PROGRESS] ${message}`, data || '');
    }
  }
}

export const logger = new Logger();