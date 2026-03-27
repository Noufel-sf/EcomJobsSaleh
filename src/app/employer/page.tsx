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
import { Sun, Moon, Briefcase, Users, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/Redux/hooks';
import { EmployerAppSidebar } from './EmployerAppSidebar';
import Link from 'next/link';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { type Language, useI18n } from '@/context/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const employerOverviewCopy: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Employer Dashboard',
    overview: 'Overview',
    home: 'Home',
    toggleTheme: 'Toggle theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    welcome: 'Welcome Back,',
    subtitle: 'Manage your job listings and review applications.',
    totalJobs: 'Total Jobs Posted',
    totalApplications: 'Total Applications',
    accepted: 'Accepted',
    pending: 'Pending Review',
    jobsDesc: '3 new this month',
    jobsSub: 'Active listings',
    appsDesc: 'Up this week',
    appsSub: 'Across all jobs',
    acceptedDesc: 'Candidates hired',
    acceptedSub: 'This quarter',
    pendingDesc: 'Awaiting decision',
    pendingSub: 'Action required',
  },
  fr: {
    dashboard: 'Tableau employeur',
    overview: "Vue d'ensemble",
    home: 'Accueil',
    toggleTheme: 'Changer le theme',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Systeme',
    welcome: 'Bon retour,',
    subtitle: 'Gerez vos offres et examinez les candidatures.',
    totalJobs: 'Offres publiees',
    totalApplications: 'Total candidatures',
    accepted: 'Acceptees',
    pending: 'En attente',
    jobsDesc: '3 nouvelles ce mois-ci',
    jobsSub: 'Offres actives',
    appsDesc: 'En hausse cette semaine',
    appsSub: 'Toutes offres confondues',
    acceptedDesc: 'Candidats recrutes',
    acceptedSub: 'Ce trimestre',
    pendingDesc: 'En attente de decision',
    pendingSub: 'Action requise',
  },
  ar: {
    dashboard: 'لوحة صاحب العمل',
    overview: 'نظرة عامة',
    home: 'الرئيسية',
    toggleTheme: 'تبديل المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    welcome: 'مرحبا بعودتك،',
    subtitle: 'ادِر الوظائف الخاصة بك وراجع الطلبات.',
    totalJobs: 'اجمالي الوظائف المنشورة',
    totalApplications: 'اجمالي طلبات التوظيف',
    accepted: 'تم القبول',
    pending: 'قيد المراجعة',
    jobsDesc: '3 وظائف جديدة هذا الشهر',
    jobsSub: 'وظائف نشطة',
    appsDesc: 'ارتفاع هذا الاسبوع',
    appsSub: 'عبر كل الوظائف',
    acceptedDesc: 'مرشحون تم توظيفهم',
    acceptedSub: 'هذا الربع',
    pendingDesc: 'بانتظار القرار',
    pendingSub: 'يتطلب اجراء',
  },
};

// Dynamic imports for better code splitting
const EmployerDashboardStats = dynamic(() => import('./components/EmployerDashboardStats'), {
  loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" />,
});

const QuickLinks = dynamic(() => import('./components/QuickLinks'), {
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" />,
});

export default function EmployerOverview() {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { language } = useI18n();
  const copy = employerOverviewCopy[language];

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: copy.totalJobs,
      value: '12',
      change: '+3',
      trend: 'up' as const,
      description: copy.jobsDesc,
      subtitle: copy.jobsSub,
      icon: Briefcase,
    },
    {
      title: copy.totalApplications,
      value: '148',
      change: '+24',
      trend: 'up' as const,
      description: copy.appsDesc,
      subtitle: copy.appsSub,
      icon: Users,
    },
    {
      title: copy.accepted,
      value: '18',
      change: '+5',
      trend: 'up' as const,
      description: copy.acceptedDesc,
      subtitle: copy.acceptedSub,
      icon: CheckCircle,
    },
    {
      title: copy.pending,
      value: '43',
      change: '-2',
      trend: 'down' as const,
      description: copy.pendingDesc,
      subtitle: copy.pendingSub,
      icon: Clock,
    },
  ], [copy.accepted, copy.acceptedDesc, copy.acceptedSub, copy.appsDesc, copy.appsSub, copy.jobsDesc, copy.jobsSub, copy.pending, copy.pendingDesc, copy.pendingSub, copy.totalApplications, copy.totalJobs]);

  return (
    <SidebarProvider>
      <EmployerAppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/employer">{copy.dashboard}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{copy.overview}</BreadcrumbPage>
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
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('light')}>{copy.light}</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('dark')}>{copy.dark}</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme('system')}>{copy.system}</DropdownMenuItem>
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
          <EmployerDashboardStats stats={stats} />

          {/* Quick Links - Using memoized component */}
          <QuickLinks />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}