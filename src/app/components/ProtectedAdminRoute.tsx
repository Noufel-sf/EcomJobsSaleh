'use client';

import { useAppSelector } from '@/Redux/hooks';
import { useRouter } from 'next/navigation';
import { Spinner } from './ui/Spinner';
import NotAuthorizedPage from '@/pages/NotAuthorizedPage';
import { useEffect, useState } from 'react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedAdminRoute = ({
  children,
  requiredRoles = ['ADMIN', 'SUPER_ADMIN', 'SELLER_ADMIN' , 'EMPLOYER'],
}: ProtectedAdminRouteProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Skip redirect logic if still loading
    if (loading) return;

    // Redirect to login if no user
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user role is in required roles (case-insensitive comparison)
    const userRole = user?.role?.toUpperCase() || '';
    const hasRequiredRole = requiredRoles.some(
      (role) => role.toUpperCase() === userRole
    );

    if (!hasRequiredRole) {
      // Unauthorized - will show NotAuthorizedPage
      setIsAuthorized(false);
      return;
    }

    // User is authorized
    setIsAuthorized(true);
  }, [user, loading, router, requiredRoles]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner show={true} size="lg" />
      </div>
    );
  }

  // No user or route changed - return null to prevent flash
  if (!user) {
    return null;
  }

  // Not authorized
  if (!isAuthorized) {
    return <NotAuthorizedPage />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
