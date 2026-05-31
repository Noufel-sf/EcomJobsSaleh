"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sun, Moon, Briefcase, Users, CheckCircle, Clock } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/Redux/hooks";
import { SuperAdminAppSidebar } from "./SuperAdminAppSidebar";
import Link from "next/link";
import { useMemo } from "react";
import { type Language, useI18n } from "@/context/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SuperAdminDashboardStats from "./components/SuperAdminDashboardStats";
import QuickLinks from "./components/QuickLinks";
import { MetricAreaChart } from "@/components/MetricAreaChart";
import {
  useGetAdminSuperStatisticsQuery,
  useGetSuperAdminGraphQuery,
} from "@/Redux/Services/UsersApi";

const superAdminOverviewCopy: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Super Admin Dashboard",
    overview: "Overview",
    home: "Home",
    toggleTheme: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    welcome: "Welcome Back,",
    subtitle: "Manage your website listings and review applications.",
    totalJobs: "Total Jobs Posted",
    totalApplications: "Total Applications",
    graphTitle: "Total Products and Jobs",
    graphDescription: "Products and jobs across the platform",
    graphTotalLabel: "Records",
    products: "Products",
    pendingProducts: "Pending Products",
    pendingJobs: "Pending Jobs",
    pendingSponsors: "Pending Sponsors",
    sellers: "Sellers",
    employers: "Employers",
    descMonth: "3 new this month",
    descUpWeek: "Up this week",
    descAwaiting: "Awaiting decision",
    subActive: "Active listings",
    subAllJobs: "Across all jobs",
    subQuarter: "This quarter",
    subAction: "Action required",
  },
  fr: {
    dashboard: "Tableau super admin",
    overview: "Vue d'ensemble",
    home: "Accueil",
    toggleTheme: "Changer le theme",
    light: "Clair",
    dark: "Sombre",
    system: "Systeme",
    welcome: "Bon retour,",
    subtitle: "Gerez les contenus du site et les demandes en attente.",
    totalJobs: "Total emplois publies",
    totalApplications: "Total candidatures",
    graphTitle: "Total produits et emplois",
    graphDescription: "Produits et emplois sur la plateforme",
    graphTotalLabel: "Enregistrements",
    products: "Produits",
    pendingProducts: "Produits en attente",
    pendingJobs: "Emplois en attente",
    pendingSponsors: "Sponsors en attente",
    sellers: "Vendeurs",
    employers: "Employeurs",
    descMonth: "3 nouveaux ce mois-ci",
    descUpWeek: "En hausse cette semaine",
    descAwaiting: "En attente de decision",
    subActive: "Annonces actives",
    subAllJobs: "Sur toutes les annonces",
    subQuarter: "Ce trimestre",
    subAction: "Action requise",
  },
  ar: {
    dashboard: "لوحة السوبر ادمن",
    overview: "نظرة عامة",
    home: "الرئيسية",
    toggleTheme: "تبديل المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
    welcome: "مرحبا بعودتك،",
    subtitle: "ادِر محتوى المنصة وراجع الطلبات قيد الانتظار.",
    totalJobs: "اجمالي الوظائف المنشورة",
    totalApplications: "اجمالي طلبات التوظيف",
    graphTitle: "اجمالي المنتجات والوظائف",
    graphDescription: "المنتجات والوظائف عبر المنصة",
    graphTotalLabel: "السجلات",
    products: "المنتجات",
    pendingProducts: "منتجات قيد الانتظار",
    pendingJobs: "وظائف قيد الانتظار",
    pendingSponsors: "رعاة قيد الانتظار",
    sellers: "البائعون",
    employers: "اصحاب العمل",
    descMonth: "3 عناصر جديدة هذا الشهر",
    descUpWeek: "ارتفاع هذا الاسبوع",
    descAwaiting: "بانتظار القرار",
    subActive: "قوائم نشطة",
    subAllJobs: "عبر كل الوظائف",
    subQuarter: "هذا الربع",
    subAction: "يتطلب اجراء",
  },
};

export default function SuperAdminOverview() {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { language } = useI18n();
  const copy = superAdminOverviewCopy[language];
  const { data: superStats } = useGetAdminSuperStatisticsQuery();
  const superAdminId = user?.userId ?? "";
  const { data: superAdminGraphResponse } = useGetSuperAdminGraphQuery(superAdminId, {
    skip: !superAdminId,
  });

  const superAdminGraphData = useMemo(() => {
    const response = superAdminGraphResponse ?? [];

    if (response.length > 0) {
      return response.map((item, index) => ({
        date: item.date ?? `2026-05-${String(index + 23).padStart(2, "0")}`,
        products: item.products ?? item.TotalProducts ?? 0,
        jobs: item.jobs ?? item.TotalJObs ?? 0,
      }));
    }

    return [
      { date: "2026-05-23", products: 3, jobs: 1 },
      { date: "2026-05-24", products: 6, jobs: 2 },
      { date: "2026-05-25", products: 4, jobs: 1 },
      { date: "2026-05-26", products: 7, jobs: 3 },
      { date: "2026-05-27", products: 5, jobs: 2 },
      { date: "2026-05-28", products: 8, jobs: 4 },
      { date: "2026-05-29", products: 6, jobs: 2 },
    ];
  }, [superAdminGraphResponse]);

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(
    () => [
      {
        title: copy.totalJobs,
        value: String(superStats?.totalJobs ?? 0),
        change: (superStats?.totalJobs ?? 0) > 0 ? "+1" : "0",
        trend: "up" as const,
        description: copy.descUpWeek,
        subtitle: copy.subAllJobs,
        icon: Briefcase,
      },
      {
        title: copy.totalApplications,
        value: String(superStats?.totalJobApplication ?? 0),
        change: (superStats?.totalJobApplication ?? 0) > 0 ? "+1" : "0",
        trend: "up" as const,
        description: copy.descMonth,
        subtitle: copy.subQuarter,
        icon: Users,
      },
      {
        title: copy.products,
        value: String(superStats?.totalProduct ?? 0),
        change: (superStats?.totalProduct ?? 0) > 0 ? "+1" : "0",
        trend: "up" as const,
        description: copy.descUpWeek,
        subtitle: copy.subActive,
        icon: CheckCircle,
      },
      {
        title: copy.sellers,
        value: String(superStats?.totalSellers ?? 0),
        change: (superStats?.totalSellers ?? 0) > 0 ? "+1" : "0",
        trend: "up" as const,
        description: copy.descMonth,
        subtitle: copy.subQuarter,
        icon: Briefcase,
      },
      {
        title: copy.employers,
        value: String(superStats?.totalCompanys ?? 0),
        change: (superStats?.totalCompanys ?? 0) > 0 ? "+1" : "0",
        trend: "up" as const,
        description: copy.descMonth,
        subtitle: copy.subQuarter,
        icon: Users,
      },
      {
        title: copy.pendingJobs,
        value: String(superStats?.totalPendingJobs ?? 0),
        change: (superStats?.totalPendingJobs ?? 0) > 0 ? "-1" : "0",
        trend: "down" as const,
        description: copy.descAwaiting,
        subtitle: copy.subAction,
        icon: Clock,
      },
      {
        title: copy.pendingProducts,
        value: String(superStats?.totalPendingProduct ?? 0),
        change: (superStats?.totalPendingProduct ?? 0) > 0 ? "-1" : "0",
        trend: "down" as const,
        description: copy.descAwaiting,
        subtitle: copy.subAction,
        icon: Clock,
      },
    ],
    [copy, superStats],
  );

  return (
    <SidebarProvider>
      <SuperAdminAppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/super-admin">
                  {copy.dashboard}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{copy.overview}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher compact />
            <Button variant="primary" className="cursor-pointer">
              <Link href="/">{copy.home}</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative cursor-pointer"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{copy.toggleTheme}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("light")}
                >
                  {copy.light}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  {copy.dark}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("system")}
                >
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
          <SuperAdminDashboardStats stats={stats} />

          <div className="mb-8">
            <MetricAreaChart
              title={copy.graphTitle}
              description={copy.graphDescription}
              totalLabel={copy.graphTotalLabel}
              totalValue={superAdminGraphData.reduce(
                (sum, item) => sum + item.products + item.jobs,
                0,
              )}
              data={superAdminGraphData}
              dateKey="date"
              primaryKey="products"
              secondaryKey="jobs"
              primaryLabel={copy.products}
              secondaryLabel={copy.totalJobs}
              primaryColor="var(--primary)"
              secondaryColor="hsl(var(--destructive))"
            />
          </div>

          <QuickLinks />


        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
