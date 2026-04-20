import type { Metadata } from 'next';
import EmployerGuard from './EmployerGuard';

export const metadata: Metadata = {
  title: 'Employer Dashboard',
  description: 'Manage your job listings and applications.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EmployerGuard>{children}</EmployerGuard>;
}