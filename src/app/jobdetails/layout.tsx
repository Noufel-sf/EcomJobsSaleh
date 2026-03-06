import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Details - Job Portal',
  description: 'View detailed job information, requirements, responsibilities, and apply now.',
  keywords: ['job details', 'apply now', 'job requirements', 'career opportunities'],
  openGraph: {
    title: 'Job Details - Job Portal',
    description: 'View detailed job information and apply today.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JobDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
