/**
 * Admin Route Security Configuration
 * 
 * This file contains the configuration for admin route protection.
 * Update these values as needed for your application.
 */

// ─── Token Configuration ───────────────────────────────────────────────────
export const AUTH_TOKEN_CONFIG = {
  // Cookie name for storing the auth token
  COOKIE_NAME: 'authToken',
  
  // Token expiration time in hours (backend should match this)
  EXPIRATION_HOURS: 24,
  
  // Secure cookie options
  COOKIE_OPTIONS: {
    httpOnly: true,      // Not accessible via JavaScript
    secure: true,        // Only sent over HTTPS
    sameSite: 'strict',  // CSRF protection
    path: '/',
  },
};

// ─── Admin Routes Configuration ─────────────────────────────────────────────
export const ADMIN_ROUTES = {
  SUPER_ADMIN: ['/admin-super'],
  SELLER_ADMIN: ['/admin-seller'],
  GENERAL_ADMIN: ['/adminusers'],
};

// ─── Role Configuration ────────────────────────────────────────────────────
export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SELLER_ADMIN: 'SELLER_ADMIN',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
  USER: 'USER',
};

// ─── API Configuration ─────────────────────────────────────────────────────
export const API_CONFIG = {
  // Default API timeout in milliseconds
  TIMEOUT: 15000,
  
  // Retry configuration for failed requests
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Request headers for security
  SECURITY_HEADERS: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-Content-Type-Options': 'nosniff',
  },
};

// ─── Session Configuration ─────────────────────────────────────────────────
export const SESSION_CONFIG = {
  // Session timeout warning time in minutes
  INACTIVITY_TIMEOUT: 30,
  
  // Check session status interval in minutes
  CHECK_INTERVAL: 5,
};

// ─── Redirect URLs ─────────────────────────────────────────────────────────
export const REDIRECT_URLS = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  HOME: '/',
};
