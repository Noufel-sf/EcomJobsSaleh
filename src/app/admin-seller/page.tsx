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
import { type Language, useI18n } from '@/context/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DashboardStats from './components/DashboardStats';

const adminOverviewCopy: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Admin Dashboard',
    crumb: 'Dashboard',
    home: 'Home',
    toggleTheme: 'Toggle theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    welcome: 'Welcome Back,',
    subtitle: 'Feel Free To Explore Your Dashboard!',
    totalRevenue: 'Total Revenue',
    newCustomers: 'New Customers',
    activeAccounts: 'Active Accounts',
    growthRate: 'Growth Rate',
    trendUpMonth: 'Trending up this month',
    visitors6Months: 'Visitors for the last 6 months',
    downPeriod: 'Down 20% this period',
    acquisition: 'Acquisition needs attention',
    retention: 'Strong user retention',
    engagement: 'Engagement exceed targets',
    steady: 'Steady performance increase',
    projections: 'Meets growth projections',
  },
  fr: {
    dashboard: 'Tableau admin',
    crumb: 'Tableau',
    home: 'Accueil',
    toggleTheme: 'Changer le theme',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Systeme',
    welcome: 'Bon retour,',
    subtitle: 'Explorez librement votre tableau de bord !',
    totalRevenue: 'Revenu total',
    newCustomers: 'Nouveaux clients',
    activeAccounts: 'Comptes actifs',
    growthRate: 'Taux de croissance',
    trendUpMonth: 'En hausse ce mois-ci',
    visitors6Months: 'Visiteurs sur les 6 derniers mois',
    downPeriod: 'En baisse de 20% sur la periode',
    acquisition: "L'acquisition necessite une attention",
    retention: 'Bonne retention des utilisateurs',
    engagement: "L'engagement depasse les objectifs",
    steady: 'Progression stable',
    projections: 'Conforme aux projections',
  },
  ar: {
    dashboard: 'لوحة تحكم البائع',
    crumb: 'لوحة التحكم',
    home: 'الرئيسية',
    toggleTheme: 'تبديل المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    welcome: 'مرحبا بعودتك،',
    subtitle: 'تصفح لوحة التحكم بحرية!',
    totalRevenue: 'اجمالي الايرادات',
    newCustomers: 'عملاء جدد',
    activeAccounts: 'حسابات نشطة',
    growthRate: 'معدل النمو',
    trendUpMonth: 'ارتفاع هذا الشهر',
    visitors6Months: 'الزوار خلال آخر 6 اشهر',
    downPeriod: 'انخفاض 20% خلال الفترة',
    acquisition: 'اكتساب العملاء يحتاج متابعة',
    retention: 'احتفاظ قوي بالمستخدمين',
    engagement: 'التفاعل يتجاوز الاهداف',
    steady: 'تحسن ثابت في الاداء',
    projections: 'متوافق مع التوقعات',
  },
};

const ChartAreaInteractive = dynamic(() => import('./chart-area-interactive').then(mod => ({ default: mod.ChartAreaInteractive })), {
  loading: () => <div className="h-64 animate-pulse bg-muted rounded-lg" />,
  ssr: false, // Disable SSR to prevent hydration errors from Radix UI Select components
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { language } = useI18n();
  const copy = adminOverviewCopy[language];

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: copy.totalRevenue,
      value: '$1,250.00',
      change: '+12.5%',
      trend: 'up' as const,
      description: copy.trendUpMonth,
      subtitle: copy.visitors6Months,
    },
    {
      title: copy.newCustomers,
      value: '1,234',
      change: '-20%',
      trend: 'down' as const,
      description: copy.downPeriod,
      subtitle: copy.acquisition,
    },
    {
      title: copy.activeAccounts,
      value: '45,678',
      change: '+12.5%',
      trend: 'up' as const,
      description: copy.retention,
      subtitle: copy.engagement,
    },
    {
      title: copy.growthRate,
      value: '4.5%',
      change: '+4.5%',
      trend: 'up' as const,
      description: copy.steady,
      subtitle: copy.projections,
    },
  ], [copy.activeAccounts, copy.acquisition, copy.engagement, copy.growthRate, copy.newCustomers, copy.projections, copy.retention, copy.steady, copy.totalRevenue, copy.trendUpMonth, copy.visitors6Months, copy.downPeriod]);

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
                <BreadcrumbLink href="/admin-seller">{copy.dashboard}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{copy.crumb}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher compact />
            <Button variant="ghost" className="cursor-pointer">
              <Link href="/">{copy.home}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative cursor-pointer">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{copy.toggleTheme}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-zinc-900 shadow-lg border border-border rounded-md"
              >
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('light')}>
                  {copy.light}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('dark')}>
                  {copy.dark}
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('system')}>
                  {copy.system}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 px-6 py-8">
          <h1 className="font-medium text-xl mb-8">
            {copy.welcome} <span>{user?.name}</span> 👋🏻
            <br />
            <span className="text-gray-600 dark:text-gray-400">
              {copy.subtitle}
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
