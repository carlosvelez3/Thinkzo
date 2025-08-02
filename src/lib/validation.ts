/**
 * Input Validation and Sanitization Utilities
 * Prevents XSS attacks and validates user input
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (international format)
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// URL validation regex
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Sanitize HTML to prevent XSS
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Sanitize and validate text input
export const validateText = (input: string, maxLength: number = 1000): { isValid: boolean; sanitized: string; error?: string } => {
  if (typeof input !== 'string') {
    return { isValid: false, sanitized: '', error: 'Input must be a string' };
  }

  const trimmed = input.trim();
  
  if (trimmed.length === 0) {
    return { isValid: false, sanitized: '', error: 'Input cannot be empty' };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, sanitized: '', error: `Input cannot exceed ${maxLength} characters` };
  }

  const sanitized = sanitizeHtml(trimmed);
  return { isValid: true, sanitized };
};

// Validate email address
export const validateEmail = (email: string): { isValid: boolean; sanitized: string; error?: string } => {
  const textValidation = validateText(email, 254); // RFC 5321 limit
  
  if (!textValidation.isValid) {
    return textValidation;
  }

  const sanitized = textValidation.sanitized.toLowerCase();
  
  if (!EMAIL_REGEX.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Invalid email format' };
  }

  return { isValid: true, sanitized };
};

// Validate phone number
export const validatePhone = (phone: string): { isValid: boolean; sanitized: string; error?: string } => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: true, sanitized: '' }; // Phone is optional
  }

  const textValidation = validateText(phone, 20);
  
  if (!textValidation.isValid) {
    return textValidation;
  }

  // Remove all non-digit characters except + at the beginning
  const cleaned = textValidation.sanitized.replace(/[^\d+]/g, '');
  
  if (!PHONE_REGEX.test(cleaned)) {
    return { isValid: false, sanitized: '', error: 'Invalid phone number format' };
  }

  return { isValid: true, sanitized: cleaned };
};

// Validate URL
export const validateUrl = (url: string): { isValid: boolean; sanitized: string; error?: string } => {
  if (!url || url.trim().length === 0) {
    return { isValid: true, sanitized: '' }; // URL is optional
  }

  const textValidation = validateText(url, 2048); // Common URL length limit
  
  if (!textValidation.isValid) {
    return textValidation;
  }

  const sanitized = textValidation.sanitized;
  
  if (!URL_REGEX.test(sanitized)) {
    return { isValid: false, sanitized: '', error: 'Invalid URL format' };
  }

  return { isValid: true, sanitized };
};

// Validate contact form data
export const validateContactForm = (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  message: string;
  subject?: string;
}): { isValid: boolean; sanitized: any; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  const sanitized: any = {};

  // Validate name
  const nameValidation = validateText(data.name, 100);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error || 'Invalid name';
  } else {
    sanitized.name = nameValidation.sanitized;
  }

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error || 'Invalid email';
  } else {
    sanitized.email = emailValidation.sanitized;
  }

  // Validate phone (optional)
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error || 'Invalid phone number';
    } else {
      sanitized.phone = phoneValidation.sanitized;
    }
  }

  // Validate company (optional)
  if (data.company) {
    const companyValidation = validateText(data.company, 200);
    if (!companyValidation.isValid) {
      errors.company = companyValidation.error || 'Invalid company name';
    } else {
      sanitized.company = companyValidation.sanitized;
    }
  }

  // Validate website (optional)
  if (data.website) {
    const websiteValidation = validateUrl(data.website);
    if (!websiteValidation.isValid) {
      errors.website = websiteValidation.error || 'Invalid website URL';
    } else {
      sanitized.website = websiteValidation.sanitized;
    }
  }

  // Validate message
  const messageValidation = validateText(data.message, 5000);
  if (!messageValidation.isValid) {
    errors.message = messageValidation.error || 'Invalid message';
  } else {
    sanitized.message = messageValidation.sanitized;
  }

  // Validate subject (optional)
  if (data.subject) {
    const subjectValidation = validateText(data.subject, 200);
    if (!subjectValidation.isValid) {
      errors.subject = subjectValidation.error || 'Invalid subject';
    } else {
      sanitized.subject = subjectValidation.sanitized;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    sanitized,
    errors
  };
};

// Rate limiting utility (client-side)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeLeft);
  }
}

export const contactFormRateLimit = new RateLimiter(3, 300000); // 3 attempts per 5 minutes
export const chatRateLimit = new RateLimiter(10, 60000); // 10 messages per minute