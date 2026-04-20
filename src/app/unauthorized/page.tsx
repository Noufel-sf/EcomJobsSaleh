import NotAuthorizedPage from '@/pages/NotAuthorizedPage';

export const metadata = {
  title: 'Access Denied - Unauthorized',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnauthorizedRoute() {
  return <NotAuthorizedPage />;
}
