import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  role?: string;
  userId?: string;
  exp?: number;
  iat?: number;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Admin route paths that require protection
  const adminPaths = ['/admin-seller', '/admin-super', '/adminusers'];
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  if (!isAdminPath) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify and decode token
    const decoded = jwtDecode<DecodedToken>(token);

    // Check token expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      // Token expired, redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('authToken');
      return response;
    }

    // Role-based route protection
    const superAdminPaths = ['/admin-super'];
    const sellerAdminPaths = ['/admin-seller'];
    const generalAdminPaths = ['/adminusers'];

    const isSuperAdminRoute = superAdminPaths.some(path => pathname.startsWith(path));
    const isSellerAdminRoute = sellerAdminPaths.some(path => pathname.startsWith(path));
    const isGeneralAdminRoute = generalAdminPaths.some(path => pathname.startsWith(path));

    const userRole = decoded.role?.toUpperCase();

    if (isSuperAdminRoute && userRole !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isSellerAdminRoute && !['SELLER', 'SELLER_ADMIN'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isGeneralAdminRoute && !['ADMIN', 'SUPER_ADMIN'].includes(userRole || '')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add user info to response headers for logging/monitoring
    const response = NextResponse.next();
    response.headers.set('x-user-id', decoded.userId || '');
    response.headers.set('x-user-role', userRole || '');

    return response;
  } catch (error) {
    // Invalid token signature or decode error
    console.error('Token verification failed:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('authToken');
    return response;
  }
}

// Apply middleware to admin routes only
export const config = {
  matcher: ['/admin-seller/:path*', '/admin-super/:path*', '/adminusers/:path*'],
};
