import { headers } from 'next/headers';
import Navbarr from '../components/Navbar';
import FooterUi from '../components/Footer';
import TopBar from '@/components/TopBar';

type Classification = {
  id: string;
  name: string;
  desc?: string;
};

type ClassificationsResponse = {
  content?: Classification[];
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  'https://wadkniss-r6ar.onrender.com/api/v1';

async function getClassifications(): Promise<Classification[]> {
  try {
    const response = await fetch(`${API_URL}/classifications`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ClassificationsResponse;
    return data.content ?? [];
  } catch {
    return [];
  }
}

export default async function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-pathname') ?? '/';
  const classifications = await getClassifications();

  const isAdmin = pathname.startsWith('/admin');
  const isMyAccount = pathname.startsWith('/my-account');
  const employer = pathname.startsWith('/employer');

  return (
    <>
      {!isAdmin && !isMyAccount && !employer && <TopBar />}
      {!isAdmin && !isMyAccount && !employer && (
        <Navbarr initialCategories={classifications} />
      )}
      {children}
      {!isAdmin && !isMyAccount && !employer && <FooterUi />}
    </>
  );
}
