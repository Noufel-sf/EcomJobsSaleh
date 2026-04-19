import type { Metadata } from 'next';
import AdminSellerGuard from './AdminSellerGuard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Saleh Store',
  description: 'Admin dashboard for managing products, orders, and store operations.',
  robots: {
    index: false, // Admin pages should never be indexed
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminSellerGuard>{children}</AdminSellerGuard>;
}
