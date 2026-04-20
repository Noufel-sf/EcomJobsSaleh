'use client';

import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

interface AdminUsersGuardProps {
  children: React.ReactNode;
}

/**
 * AdminUsersGuard
 * 
 * Protects admin users management routes with role-based access control.
 * Only users with ADMIN or SUPER_ADMIN roles can access routes wrapped with this guard.
 */
export default function AdminUsersGuard({ children }: AdminUsersGuardProps) {
  return (
    <ProtectedAdminRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
      {children}
    </ProtectedAdminRoute>
  );
}
