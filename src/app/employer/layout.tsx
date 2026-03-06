'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { EmployerAppSidebar } from './employer-app-sidebar';

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EmployerAppSidebar />
      {children}
    </SidebarProvider>
  );
}
