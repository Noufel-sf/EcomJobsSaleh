
import type { Metadata } from 'next';
import SuperAdminGuard from './SuperAdminGuard';

export const metadata: Metadata = {
  title: 'Super Admin Dashboard',
  description: 'Super admin dashboard for managing platform content, users, and products.',
  robots: {
    index: false, // Admin pages should never be indexed
    follow: false,
    nocache: true,
  },
};

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SuperAdminGuard>{children}</SuperAdminGuard>;
}