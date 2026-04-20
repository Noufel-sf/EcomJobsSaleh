import type { Metadata } from 'next';
import SellerAdminGuard from './SellerAdminGuard';

export const metadata: Metadata = {
  title: 'Seller Admin Dashboard - Saleh Store',
  description: 'Admin dashboard for managing products, orders, and store operations.',
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerAdminGuard>{children}</SellerAdminGuard>;
}
