'use client';

import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

interface EmployerGuardProps {
  children: React.ReactNode;
}

/**
 * EmployerGuard
 *
 * Protects employer routes with role-based access control.
 * Only users with EMPLOYER role can access routes wrapped with this guard.
 */
export default function EmployerGuard({ children }: EmployerGuardProps) {
  return <ProtectedAdminRoute requiredRoles={['EMPLOYER']}>{children}</ProtectedAdminRoute>;
}
