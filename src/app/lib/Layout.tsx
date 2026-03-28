'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const Navbarr = dynamic(() => import('../components/Navbar'), {
  ssr: false,
});

const FooterUi = dynamic(() => import('../components/Footer'), {
  ssr: false,
});

const TopBar = dynamic(() => import('@/components/TopBar'), {
  ssr: false,
});


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
