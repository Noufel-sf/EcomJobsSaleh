'use client';

import FooterUi from '../components/Footer';
import Navbarr from '../components/Navbar';
import TopBar from '@/components/TopBar';
import { usePathname } from 'next/navigation';

type Classification = {
  id: string;
  name: string;
  desc?: string;
};

type LayoutVisibilityProps = {
  children: React.ReactNode;
  classifications: Classification[];
};

const LOCALE_SEGMENTS = new Set(['en', 'ar', 'fr']);

function getFirstSegment(pathname: string): string | undefined {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return undefined;

  return LOCALE_SEGMENTS.has(segments[0]) ? segments[1] : segments[0];
}

export default function LayoutVisibility({
  children,
  classifications,
}: LayoutVisibilityProps) {
  const pathname = usePathname() ?? '/';
  const firstSegment = getFirstSegment(pathname);

  const isAdmin =
    firstSegment === 'admin' ||
    firstSegment === 'admin-super' ||
    firstSegment === 'admin-seller';
  const isEmployer = firstSegment === 'employer';
  const hideSiteChrome = isAdmin || isEmployer;

  return (
    <>
      {!hideSiteChrome && <TopBar />}
      {!hideSiteChrome && <Navbarr initialCategories={classifications} />}
      {children}
      {!hideSiteChrome && <FooterUi />}
    </>
  );
}
