'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { ReduxProvider } from '@/Redux/ReduxProvider';
import { I18nProvider } from '@/context/I18nContext';
import LayoutWrapper from './Layout';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ReduxProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ReduxProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
