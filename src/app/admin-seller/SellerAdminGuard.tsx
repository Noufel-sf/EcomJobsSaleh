'use client';

import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

interface SellerAdminGuardProps {
  children: React.ReactNode;
}

/**
 * SellerAdminGuard
 * 
 * Protects seller admin routes with role-based access control.
 * Only users with SELLER or SELLER_ADMIN roles can access routes wrapped with this guard.
 */
export default function SellerAdminGuard({ children }: SellerAdminGuardProps) {
  return (
    <ProtectedAdminRoute requiredRoles={['ADMIN-SELLER']}>
      {children}
    </ProtectedAdminRoute>
  );
}
