import type { Metadata } from 'next';
import AdminUsersGuard from './AdminUsersGuard';

export const metadata: Metadata = {
  title: 'Admin Users Management',
  description: 'Manage and monitor all admin users and their permissions.',
  robots: {
    index: false, // Admin pages should never be indexed
    follow: false,
    nocache: true,
  },
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminUsersGuard>{children}</AdminUsersGuard>;
}
