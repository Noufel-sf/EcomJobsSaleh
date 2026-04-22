'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { ReduxProvider } from '@/Redux/ReduxProvider';
import { I18nProvider } from '@/context/I18nContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nProvider>
      <ThemeProvider>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
