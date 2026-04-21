'use client';

import { useAppSelector } from '@/Redux/hooks';
import { useRouter } from 'next/navigation';
import { Spinner } from './ui/Spinner';
import NotAuthorizedPage from '@/pages/NotAuthorizedPage';
import { useEffect } from 'react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedAdminRoute = ({
  children,
  requiredRoles = ['ADMIN', 'ADMIN-SUPER', 'ADMIN-SELLER' , 'EMPLOYER'],
}: ProtectedAdminRouteProps) => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const normalizeRole = (value?: string) =>
    (value || '').trim().toUpperCase().replace(/^ROLE_/, '');

  const userRole = normalizeRole(user?.role);
  
  const hasRequiredRole = requiredRoles.some(
    (role) => normalizeRole(role) === userRole
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner show={true} size="large" className="">
          Loading...
        </Spinner>
      </div>
    );
  }

  // No user or route changed - return null to prevent flash
  if (!user) {
    return null;
  }

  // Not authorized
  if (!hasRequiredRole) {
    return <NotAuthorizedPage />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
