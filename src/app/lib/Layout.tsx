'use client';

import { usePathname } from 'next/navigation';
import Navbarr from '../components/Navbar';
import FooterUi from '../components/Footer';
import TopBar from '@/components/TopBar';


export default function LayoutWrapper({ children }: { children: React.ReactNode  }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isMyAccount = pathname.startsWith('/my-account');
  const employer = pathname.startsWith('/employer');

  return (
    <>
      {!isAdmin && !isMyAccount && !employer && <TopBar />}
      {!isAdmin && !isMyAccount && !employer && <Navbarr />}
      {children}
      {!isAdmin && !isMyAccount && !employer && <FooterUi />}
    </>
  );
}
