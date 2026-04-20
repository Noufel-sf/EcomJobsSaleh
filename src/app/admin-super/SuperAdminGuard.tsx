'use client';

import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

interface SuperAdminGuardProps {
  children: React.ReactNode;
}

/**
 * SuperAdminGuard
 * 
 * Protects super admin routes with role-based access control.
 * Only users with SUPER_ADMIN role can access routes wrapped with this guard.
 */
export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  return (
    <ProtectedAdminRoute requiredRoles={['SUPER_ADMIN']}>
      {children}
    </ProtectedAdminRoute>
  );
}
