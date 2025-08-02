/**
 * Enhanced Error Handling Utilities
 * Improved error logging and user feedback
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userMessage: string;
}

// Error codes for different types of errors
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// Create standardized error objects
export const createError = (
  code: keyof typeof ERROR_CODES,
  message: string,
  details?: any,
  userMessage?: string
): AppError => ({
  code,
  message,
  details,
  timestamp: new Date(),
  userMessage: userMessage || getUserFriendlyMessage(code, message)
});

// Convert technical errors to user-friendly messages
const getUserFriendlyMessage = (code: string, technicalMessage: string): string => {
  switch (code) {
    case ERROR_CODES.VALIDATION_ERROR:
      return 'Please check your input and try again.';
    case ERROR_CODES.NETWORK_ERROR:
      return 'Connection error. Please check your internet and try again.';
    case ERROR_CODES.AUTH_ERROR:
      return 'Authentication failed. Please sign in and try again.';
    case ERROR_CODES.DATABASE_ERROR:
      return 'We\'re experiencing technical difficulties. Please try again later.';
    case ERROR_CODES.RATE_LIMIT_ERROR:
      return 'Too many requests. Please wait a moment and try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

// Enhanced error logging
export const logError = (error: AppError | Error, context?: string) => {
  const errorData = {
    timestamp: new Date().toISOString(),
    context: context || 'Unknown',
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error('Application Error:', errorData);
  }

  // In production, you might want to send to an error tracking service
  // Example: Sentry, LogRocket, or custom endpoint
  if (import.meta.env.PROD) {
    // sendToErrorTracking(errorData);
  }
};

// Async error wrapper with retry logic
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw createError(
          'NETWORK_ERROR',
          `Operation failed after ${maxRetries} attempts`,
          { originalError: error, attempts: attempt }
        );
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};

// Safe async operation wrapper
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<{ data: T | null; error: AppError | null }> => {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const appError = error instanceof Error 
      ? createError('UNKNOWN_ERROR', error.message, { originalError: error })
      : createError('UNKNOWN_ERROR', 'Unknown error occurred', { originalError: error });
    
    logError(appError, context);
    
    return { 
      data: fallback || null, 
      error: appError 
    };
  }
};

// Form submission error handler
export const handleFormError = (error: any, fieldName?: string): string => {
  if (error?.code === 'VALIDATION_ERROR') {
    return error.userMessage;
  }

  if (error?.message?.includes('duplicate key')) {
    return fieldName 
      ? `This ${fieldName} is already in use. Please choose another.`
      : 'This information is already in use. Please check your input.';
  }

  if (error?.message?.includes('foreign key')) {
    return 'Referenced data not found. Please refresh and try again.';
  }

  if (error?.message?.includes('not null')) {
    return fieldName 
      ? `${fieldName} is required.`
      : 'Required field is missing.';
  }

  return error?.userMessage || error?.message || 'An error occurred. Please try again.';
};

// Network error detection
export const isNetworkError = (error: any): boolean => {
  return (
    error?.name === 'NetworkError' ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('network') ||
    error?.code === 'NETWORK_ERROR'
  );
};

// Supabase error handler
export const handleSupabaseError = (error: any): AppError => {
  if (error?.code === 'PGRST116') {
    return createError('DATABASE_ERROR', 'No data found', error, 'The requested information was not found.');
  }
  
  if (error?.code === '23505') {
    return createError('VALIDATION_ERROR', 'Duplicate entry', error, 'This information already exists.');
  }
  
  if (error?.code === '23503') {
    return createError('DATABASE_ERROR', 'Foreign key constraint', error, 'Referenced data not found.');
  }
  
  if (error?.message?.includes('JWT')) {
    return createError('AUTH_ERROR', 'Authentication error', error, 'Please sign in and try again.');
  }

  return createError('DATABASE_ERROR', error?.message || 'Database error', error);
};