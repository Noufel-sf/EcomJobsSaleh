'use client';

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/Redux/hooks';
import { AdminAppSidebar } from './admin-app-sidebar';
import Link from 'next/link';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for better code splitting
const DashboardStats = dynamic(() => import('./components/DashboardStats'), {
  loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" />,
});

const ChartAreaInteractive = dynamic(() => import('./chart-area-interactive').then(mod => ({ default: mod.ChartAreaInteractive })), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  ssr: false, // Disable SSR to prevent hydration errors from Radix UI Select components
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: 'Total Revenue',
      value: '$1,250.00',
      change: '+12.5%',
      trend: 'up' as const,
      description: 'Trending up this month',
      subtitle: 'Visitors for the last 6 months',
    },
    {
      title: 'New Customers',
      value: '1,234',
      change: '-20%',
      trend: 'down' as const,
      description: 'Down 20% this period',
      subtitle: 'Acquisition needs attention',
    },
    {
      title: 'Active Accounts',
      value: '45,678',
      change: '+12.5%',
      trend: 'up' as const,
      description: 'Strong user retention',
      subtitle: 'Engagement exceed targets',
    },
    {
      title: 'Growth Rate',
      value: '4.5%',
      change: '+4.5%',
      trend: 'up' as const,
      description: 'Steady performance increase',
      subtitle: 'Meets growth projections',
    },
  ], []);

  return (
    <SidebarProvider>
      {/* Sidebar */}
      <AdminAppSidebar />

      {/* Main Content */}
      <SidebarInset>
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin-seller">Admin Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" className="cursor-pointer">
              <Link href="/">Home</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-zinc-900 shadow-lg border border-border rounded-md"
              >
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('light')}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('dark')}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('system')}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 px-6 py-8">
          <h1 className="font-medium text-xl mb-8">
            Welcome Back, <span>{user?.name}</span> 👋🏻
            <br />
            <span className="text-gray-600 dark:text-gray-400">
              Feel Free To Explore Your Dashboard!
            </span>
          </h1>

          {/* Stats Grid - Using memoized component */}
          <DashboardStats stats={stats} />

          {/* Chart Section */}
          <div className="mb-8">
            <ChartAreaInteractive />
          </div>
        </div>

        {/* Page Body */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
