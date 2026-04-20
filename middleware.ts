import { NextResponse } from 'next/server';

export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-seller/:path*', '/admin-super/:path*', '/employer/:path*'],
};
