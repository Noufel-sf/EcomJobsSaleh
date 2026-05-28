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
import { useGetAdminSellerStatisticsQuery } from '@/Redux/Services/UsersApi';
import { useGetSellerOrdersQuery } from '@/Redux/Services/OrderApi';

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
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    successfulOrders: 'Successful Orders',
    waitingOrders: 'Waiting Orders',
    totalSalesDesc: 'Overall revenue from completed sales',
    totalOrdersDesc: 'All received orders',
    successfulOrdersDesc: 'Orders delivered successfully',
    waitingOrdersDesc: 'Orders still in progress',
    totalSalesSub: 'Revenue summary',
    totalOrdersSub: 'Order activity',
    successfulOrdersSub: 'Completed workflow',
    waitingOrdersSub: 'Needs follow-up',
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
    totalSales: 'Ventes totales',
    totalOrders: 'Commandes totales',
    successfulOrders: 'Commandes reussies',
    waitingOrders: 'Commandes en attente',
    totalSalesDesc: 'Revenu global des ventes finalisees',
    totalOrdersDesc: 'Toutes les commandes recues',
    successfulOrdersDesc: 'Commandes livrees avec succes',
    waitingOrdersDesc: 'Commandes encore en cours',
    totalSalesSub: 'Resume des revenus',
    totalOrdersSub: 'Activite des commandes',
    successfulOrdersSub: 'Traitement termine',
    waitingOrdersSub: 'Suivi requis',
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
    totalSales: 'اجمالي المبيعات',
    totalOrders: 'اجمالي الطلبات',
    successfulOrders: 'الطلبات الناجحة',
    waitingOrders: 'الطلبات قيد الانتظار',
    totalSalesDesc: 'الايرادات الاجمالية من المبيعات المكتملة',
    totalOrdersDesc: 'جميع الطلبات المستلمة',
    successfulOrdersDesc: 'طلبات تم تسليمها بنجاح',
    waitingOrdersDesc: 'طلبات ما زالت قيد المعالجة',
    totalSalesSub: 'ملخص الايرادات',
    totalOrdersSub: 'نشاط الطلبات',
    successfulOrdersSub: 'عمليات مكتملة',
    waitingOrdersSub: 'تحتاج متابعة',
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
  const { data: sellerStats } = useGetAdminSellerStatisticsQuery();
  const { data: ordersData } = useGetSellerOrdersQuery(
    { Seller_id: user?.userId ?? '', size: 365 },
    { skip: !user?.userId },
  );
  const totalOrders = sellerStats?.totalOrders ?? 0;

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(() => [
    {
      title: copy.totalSales,
      value: String(sellerStats?.totalSales ?? 0),
      change: (sellerStats?.totalSales ?? 0) > 0 ? '+1' : '0',
      trend: 'up' as const,
      description: copy.totalSalesDesc,
      subtitle: copy.totalSalesSub,
    },
    {
      title: copy.totalOrders,
      value: String(sellerStats?.totalOrders ?? 0),
      change: (sellerStats?.totalOrders ?? 0) > 0 ? '+1' : '0',
      trend: 'up' as const,
      description: copy.totalOrdersDesc,
      subtitle: copy.totalOrdersSub,
    },
    {
      title: copy.successfulOrders,
      value: String(sellerStats?.successfulOrders ?? 0),
      change: (sellerStats?.successfulOrders ?? 0) > 0 ? '+1' : '0',
      trend: 'up' as const,
      description: copy.successfulOrdersDesc,
      subtitle: copy.successfulOrdersSub,
    },
    {
      title: copy.waitingOrders,
      value: String(sellerStats?.waitingOrders ?? 0),
      change: (sellerStats?.waitingOrders ?? 0) > 0 ? '-1' : '0',
      trend: 'down' as const,
      description: copy.waitingOrdersDesc,
      subtitle: copy.waitingOrdersSub,
    },
  ], [copy, sellerStats]);

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
                data={useMemo(() => {
                  const orders = (ordersData?.content ?? []) as unknown[];
                  // determine date field name if present
                  const dateValues = orders
                    .map((o) => {
                      const oo = o as unknown as Record<string, unknown>;
                      const created = (oo['createdAt'] ?? oo['created_at'] ?? oo['date'] ?? oo['orderDate']) as string | undefined;
                      return created;
                    })
                    .filter(Boolean) as string[];

                  if (!dateValues || dateValues.length === 0) {
                    // fallback: single point with totalOrders
                    return [
                      { date: new Date().toISOString().split('T')[0], mobile: totalOrders, desktop: 0 },
                    ];
                  }

                  // build counts per day
                  const counts: Record<string, { total: number; successful: number }> = {};
                  const isSuccessful = (status?: string) => status === 'Delivered';

                  orders.forEach((o) => {
                    const oo = o as unknown as Record<string, unknown>;
                    const created = (oo['createdAt'] ?? oo['created_at'] ?? oo['date'] ?? oo['orderDate']) as string | undefined;
                    const d = new Date(created ?? '');
                    if (isNaN(d.getTime())) return;
                    const key = d.toISOString().split('T')[0];
                    if (!counts[key]) counts[key] = { total: 0, successful: 0 };
                    counts[key].total += 1;
                    const status = (oo['status'] ?? '') as string;
                    if (isSuccessful(status)) counts[key].successful += 1;
                  });

                  // create series for last 90 days
                  const series: { date: string; mobile: number; desktop: number }[] = [];
                  const today = new Date();
                  for (let i = 90; i >= 0; i--) {
                    const d = new Date(today);
                    d.setDate(d.getDate() - i);
                    const key = d.toISOString().split('T')[0];
                    const c = counts[key] ?? { total: 0, successful: 0 };
                    series.push({ date: key, mobile: c.total, desktop: c.successful });
                  }
                  return series;
                }, [ordersData, totalOrders])}
              />
          </div>
        </div>

        {/* Page Body */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
