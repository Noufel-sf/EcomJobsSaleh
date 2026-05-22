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
import { type Language, useI18n } from '@/context/I18nContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import DashboardStats from './components/DashboardStats';
import { MetricAreaChart } from '@/components/MetricAreaChart';
import { useGetSellerInfoQuery } from '@/Redux/Services/SellerApi';
import { useGetStatisticsQuery } from '@/Redux/Services/ProductsApi';

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
    totalProducts: 'Total Products',
    availableProducts: 'Available Products',
    unavailableProducts: 'Unavailable Products',
    sponsoredProducts: 'Sponsored Products',
    totalProductsDesc: 'All products in your catalog',
    availableProductsDesc: 'Items currently available',
    unavailableProductsDesc: 'Items currently unavailable',
    sponsoredProductsDesc: 'Items marked as sponsored',
    totalProductsSub: 'Overall inventory',
    availableProductsSub: 'Ready for customers',
    unavailableProductsSub: 'Needs attention',
    sponsoredProductsSub: 'Promoted listings',
    ordersChartTitle: 'Total Orders',
    ordersChartDescription: 'Orders for the last 3 months',
    ordersTotalLabel: 'Orders',
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
    totalProducts: 'Produits totaux',
    availableProducts: 'Produits disponibles',
    unavailableProducts: 'Produits indisponibles',
    sponsoredProducts: 'Produits sponsorises',
    totalProductsDesc: 'Tous les produits de votre catalogue',
    availableProductsDesc: 'Elements actuellement disponibles',
    unavailableProductsDesc: 'Elements actuellement indisponibles',
    sponsoredProductsDesc: 'Elements marques comme sponsorises',
    totalProductsSub: 'Inventaire global',
    availableProductsSub: 'Prêts pour les clients',
    unavailableProductsSub: 'A surveiller',
    sponsoredProductsSub: 'Annonces promues',
    ordersChartTitle: 'Total des commandes',
    ordersChartDescription: 'Commandes sur les 3 derniers mois',
    ordersTotalLabel: 'Commandes',
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
    totalProducts: 'اجمالي المنتجات',
    availableProducts: 'المنتجات المتاحة',
    unavailableProducts: 'المنتجات غير المتاحة',
    sponsoredProducts: 'المنتجات المدعومة',
    totalProductsDesc: 'كل المنتجات في الكتالوج الخاص بك',
    availableProductsDesc: 'العناصر المتاحة حاليا',
    unavailableProductsDesc: 'العناصر غير المتاحة حاليا',
    sponsoredProductsDesc: 'العناصر المعلمة كمدعومة',
    totalProductsSub: 'المخزون بالكامل',
    availableProductsSub: 'جاهزة للعملاء',
    unavailableProductsSub: 'تحتاج متابعة',
    sponsoredProductsSub: 'المنتجات المروجة',
    ordersChartTitle: 'اجمالي الطلبات',
    ordersChartDescription: 'الطلبات خلال آخر 3 اشهر',
    ordersTotalLabel: 'الطلبات',
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const { language } = useI18n();
  const copy = adminOverviewCopy[language];
  const sellerId = user?.userId ?? '';
  const { data: sellerInfo } = useGetSellerInfoQuery(sellerId, {
    skip: !sellerId,
  });
  const { data: productStats } = useGetStatisticsQuery();
  const totalOrders = sellerInfo?.total_orders ?? 0;

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: copy.totalProducts,
      value: String(productStats?.totalProducts ?? 0),
      change: productStats?.totalProducts ? '+1' : '0',
      trend: 'up' as const,
      description: copy.totalProductsDesc,
      subtitle: copy.totalProductsSub,
    },
    {
      title: copy.availableProducts,
      value: String(productStats?.totalAvailableProducts ?? 0),
      change: productStats?.totalAvailableProducts ? '+1' : '0',
      trend: 'up' as const,
      description: copy.availableProductsDesc,
      subtitle: copy.availableProductsSub,
    },
    {
      title: copy.unavailableProducts,
      value: String(productStats?.totalNotAvailableProducts ?? 0),
      change: productStats?.totalNotAvailableProducts ? '-1' : '0',
      trend: 'down' as const,
      description: copy.unavailableProductsDesc,
      subtitle: copy.unavailableProductsSub,
    },
    {
      title: copy.sponsoredProducts,
      value: String(productStats?.totalSponsoredProducts ?? 0),
      change: productStats?.totalSponsoredProducts ? '+1' : '0',
      trend: 'up' as const,
      description: copy.sponsoredProductsDesc,
      subtitle: copy.sponsoredProductsSub,
    },
  ], [
    copy.availableProducts,
    copy.availableProductsDesc,
    copy.availableProductsSub,
    copy.sponsoredProducts,
    copy.sponsoredProductsDesc,
    copy.sponsoredProductsSub,
    copy.totalProducts,
    copy.totalProductsDesc,
    copy.totalProductsSub,
    copy.unavailableProducts,
    copy.unavailableProductsDesc,
    copy.unavailableProductsSub,
    productStats,
  ]);

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
            <MetricAreaChart
              title={copy.ordersChartTitle}
              description={copy.ordersChartDescription}
              totalLabel={copy.ordersTotalLabel}
              totalValue={totalOrders}
            />
          </div>
        </div>

        {/* Page Body */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
