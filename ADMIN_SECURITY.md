# Admin Route Security Implementation Guide

## Overview
This document outlines the comprehensive security implementation for protecting admin routes in the EcomJobs application. The implementation includes multiple layers of protection:

1. **Server-side middleware** - Token validation before routes load
2. **Client-side guards** - Role-based access control
3. **API interceptors** - Automatic token refresh and error handling
4. **Security headers** - Cache control and anti-clickjacking

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  User Request to Admin Route (/admin-seller, /admin-super)  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Middleware (middleware.ts) │ ← Server-side protection
        │  • Verify auth token       │
        │  • Check token expiration  │
        │  • Role-based routing      │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │   Layout Component         │ ← Security metadata
        │   • Set cache headers      │
        │   • Prevent indexing       │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │    Guard Component         │ ← Client-side protection
        │  (SuperAdminGuard, etc.)   │
        └────────┬───────────────────┘
                 │
                 ▼
        ┌────────────────────────────┐
        │  ProtectedAdminRoute       │ ← Role validation
        │  • Check user exists       │
        │  • Validate user role      │
        │  • Check authorization     │
        └────────┬───────────────────┘
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
✓ Authorized          ✗ Unauthorized
   │                        │
   ▼                        ▼
Protected            NotAuthorizedPage
Page Content         (Show error & options)
```

---

## Implementation Details

### 1. Server-Side Middleware (`middleware.ts`)

**Location:** `c:\Users\TRETEC\Documents\WebDev\NestJs\EcomJobs\EcomJobsSaleh\middleware.ts`

**Responsibilities:**
- Intercepts all requests to admin routes
- Validates JWT tokens from cookies
- Checks token expiration
- Enforces role-based route access
- Prevents client-side bypass attempts

**Key Features:**
- ✅ Token signature verification using `jwt-decode`
- ✅ Expiration timestamp validation
- ✅ Role-specific route protection
- ✅ Automatic cookie deletion on token expiration
- ✅ User context headers for logging

**Matching Paths:**
```
/admin-seller/*      → Requires SELLER or SELLER_ADMIN role
/admin-super/*       → Requires SUPER_ADMIN role
/adminusers/*        → Requires ADMIN or SUPER_ADMIN role
```

**Example Flow:**
```
1. User requests /admin-seller/products
2. Middleware checks authToken cookie
3. If no token → Redirect to /login
4. If token expired → Delete cookie & redirect to /login
5. If token valid → Check user role
6. If role is SELLER → Allow access
7. If role is not SELLER → Redirect to /unauthorized
8. If role valid → Continue to page
```

---

### 2. Client-Side Guards

#### SuperAdminGuard
**Location:** `src/app/admin-super/SuperAdminGuard.tsx`

Wraps super admin routes with role-based protection.

```tsx
// Usage in layout
import SuperAdminGuard from './SuperAdminGuard';

export default function Layout({ children }) {
  return <SuperAdminGuard>{children}</SuperAdminGuard>;
}
```

#### SellerAdminGuard
**Location:** `src/app/admin-seller/SellerAdminGuard.tsx`

Protects seller admin routes.

```tsx
// Allows access for SELLER or SELLER_ADMIN roles
<ProtectedAdminRoute requiredRoles={['SELLER', 'SELLER_ADMIN']}>
  {children}
</ProtectedAdminRoute>
```

#### AdminUsersGuard
**Location:** `src/app/adminusers/AdminUsersGuard.tsx`

Protects general admin user management.

```tsx
// Allows access for ADMIN or SUPER_ADMIN roles
<ProtectedAdminRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
  {children}
</ProtectedAdminRoute>
```

---

### 3. Core Protection Component (`ProtectedAdminRoute.tsx`)

**Location:** `src/app/components/ProtectedAdminRoute.tsx`

**Features:**
- ✅ Redux-based user state checking
- ✅ Flexible role configuration
- ✅ Loading state management
- ✅ Case-insensitive role comparison
- ✅ Unauthorized page fallback

**Usage:**
```tsx
<ProtectedAdminRoute requiredRoles={['SUPER_ADMIN', 'ADMIN']}>
  <YourAdminComponent />
</ProtectedAdminRoute>
```

---

### 4. Layout Security Metadata

**Files Updated:**
- `src/app/admin-seller/layout.tsx`
- `src/app/admin-super/layout.tsx`
- `src/app/adminusers/layout.tsx`

**Security Headers Added:**
```tsx
export const metadata: Metadata = {
  robots: {
    index: false,        // Don't index in search engines
    follow: false,       // Don't follow links
    nocache: true,       // Don't cache
  },
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};
```

**Purpose:**
- Prevents caching of sensitive admin pages
- Blocks search engine indexing
- Ensures fresh content on each request

---

### 5. API Interceptor (`lib/Api.ts`)

**Location:** `src/app/lib/Api.ts`

**Request Interceptor:**
```tsx
// Automatically adds:
// - Credentials (cookies with auth token)
// - Security headers
// - Request timeout (15s)
```

**Response Interceptor Handles:**

**401 Unauthorized:**
- Token expired or invalid
- Action: Logout, clear cookies, redirect to /login

**403 Forbidden:**
- Insufficient permissions for endpoint
- Action: Redirect to /unauthorized

**500+ Server Errors:**
- Application errors
- Action: Log errors, continue rejection

---

### 6. Unauthorized Page (`pages/NotAuthorizedPage.tsx`)

**Features:**
- ✅ Display current user role
- ✅ Show requested access level
- ✅ Action buttons (Go Back, Go Home)
- ✅ Contact support link
- ✅ Dark mode support

**Rendered at:** `/unauthorized`

---

## Configuration

### Environment Variables

Create or update `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://wadkniss-r6ar.onrender.com/api/v1

# Token Configuration (optional - matches backend)
NEXT_PUBLIC_TOKEN_COOKIE_NAME=authToken
NEXT_PUBLIC_TOKEN_EXPIRY_HOURS=24
```

### Backend Requirements

The backend must:

1. **Issue JWT tokens with:**
   - `role` claim (SUPER_ADMIN, SELLER_ADMIN, SELLER, ADMIN, USER)
   - `userId` claim
   - `exp` claim (expiration timestamp in seconds)
   - `iat` claim (issued at timestamp)

2. **Set token in cookies with:**
   - Name: `authToken`
   - HttpOnly flag (mandatory)
   - Secure flag (HTTPS only)
   - SameSite: Strict
   - Path: /

3. **Example JWT Payload:**
   ```json
   {
     "userId": "user123",
     "role": "SUPER_ADMIN",
     "email": "admin@example.com",
     "iat": 1713607200,
     "exp": 1713693600
   }
   ```

---

## User Roles & Permissions

| Role | Admin Routes | Permissions |
|------|---|---|
| **SUPER_ADMIN** | `/admin-super/*` | Full platform management |
| **SELLER_ADMIN** | `/admin-seller/*` | Seller store management |
| **SELLER** | `/admin-seller/*` | Seller store management |
| **ADMIN** | `/adminusers/*` | User management |
| **USER** | None | Public pages only |

---

## Security Best Practices Implemented

### ✅ What We Do

1. **Server-Side Validation**
   - Token verified on middleware before page loads
   - Prevents client-side bypass attempts
   - Role checks on every API call

2. **Token Management**
   - Tokens stored in HttpOnly cookies (safe from XSS)
   - Expiration validation on each request
   - Automatic logout on expiration

3. **Role-Based Access**
   - Multiple role support per route
   - Case-insensitive comparison
   - Flexible configuration

4. **Security Headers**
   - Cache-Control headers prevent caching
   - Robots.txt directives block indexing
   - No-cache pragmas force fresh content

5. **Error Handling**
   - Specific error pages for 401/403
   - User-friendly unauthorized page
   - Logging for security audit trail

### ⚠️ Important Security Notes

1. **Never store sensitive data in Redux/localStorage**
   - Only store non-sensitive user info
   - Keep tokens in HttpOnly cookies only

2. **Always validate on the backend**
   - Client-side checks are for UX, not security
   - Every API call should verify token and role

3. **HTTPS in production**
   - Secure flag requires HTTPS
   - Configure your server for SSL/TLS

4. **Regular token rotation**
   - Implement token refresh mechanism
   - Typically refresh on expiration or inactivity

---

## Testing Admin Protection

### Manual Testing

1. **Test Super Admin Access:**
   ```
   1. Login with SUPER_ADMIN role
   2. Navigate to /admin-super
   3. Should display dashboard
   4. Try /admin-seller → Should show unauthorized
   ```

2. **Test Token Expiration:**
   ```
   1. Login to admin panel
   2. Wait for token expiration time
   3. Make an API call → Should redirect to login
   ```

3. **Test Unauthorized Access:**
   ```
   1. Manually set authToken in cookies
   2. Try to access admin route with wrong role
   3. Should redirect to /unauthorized
   ```

### Automated Testing (Example)

```typescript
describe('Admin Route Protection', () => {
  it('should redirect unauthenticated users to login', () => {
    // Clear authToken cookie
    // Navigate to /admin-seller
    // Assert redirected to /login
  });

  it('should show unauthorized page for insufficient role', () => {
    // Set authToken with SELLER role
    // Navigate to /admin-super
    // Assert shown /unauthorized page
  });

  it('should allow access with correct role', () => {
    // Set authToken with SUPER_ADMIN role
    // Navigate to /admin-super
    // Assert page loads successfully
  });
});
```

---

## Troubleshooting

### Issue: Redirects to login on every page load

**Causes:**
- Token expiration too short
- Time sync issues between client and server
- Token not being sent in requests

**Solutions:**
- Verify backend token expiration time
- Check system time synchronization
- Verify cookies are being sent (`withCredentials: true`)

### Issue: Redirects to unauthorized instead of showing admin page

**Causes:**
- User role doesn't match required roles
- Role value case mismatch
- Backend returning wrong role in token

**Solutions:**
- Verify user role in Redux state
- Check middleware role comparison
- Inspect JWT token claims in browser DevTools

### Issue: Admin page shows for a moment then redirects

**Causes:**
- Flash of unsecured content (FOUC)
- User state loading from Redux

**Solutions:**
- Check `loading` state in ProtectedAdminRoute
- Ensure Spinner displays during auth check
- Verify Redux initialization order

---

## Maintenance

### Regular Security Updates

1. **Monitor JWT expiration times**
   - Adjust if breach is suspected
   - Coordinate with backend team

2. **Review access logs**
   - Check for unauthorized access attempts
   - Monitor failed login patterns

3. **Update role definitions**
   - Add new roles as needed
   - Document permission changes
   - Update middleware and guards

4. **Keep dependencies updated**
   - Monitor jwt-decode updates
   - Update Next.js for security patches
   - Review axios security advisories

---

## Support & Questions

For questions about this implementation:
1. Review the code comments in each file
2. Check the configuration file: `lib/adminSecurityConfig.ts`
3. Consult backend team for JWT requirements
4. Review Next.js middleware documentation

---

**Last Updated:** April 20, 2026
**Implementation Status:** ✅ Complete
