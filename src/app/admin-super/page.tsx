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
import dynamic from "next/dynamic";
import { ChartAreaInteractive } from "@/admin-super/components/chart-area-interactive";

// Dynamic imports for better code splitting
const SuperAdminDashboardStats = dynamic(
  () => import("./components/SuperAdminDashboardStats"),
  {
    loading: () => <div className="h-32 animate-pulse bg-muted rounded-lg" />,
  },
);

const QuickLinks = dynamic(() => import("./components/QuickLinks"), {
  loading: () => <div className="h-48 animate-pulse bg-muted rounded-lg" />,
});

export default function SuperAdminOverview() {
  const { setTheme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  // Memoize stats data to prevent unnecessary re-renders
  const stats = useMemo(
    () => [
      {
        title: "Total Jobs Posted",
        value: "12",
        change: "+3",
        trend: "up" as const,
        description: "3 new this month",
        subtitle: "Active listings",
        icon: Briefcase,
      },
      {
        title: "Total Applications",
        value: "148",
        change: "+24",
        trend: "up" as const,
        description: "Up this week",
        subtitle: "Across all jobs",
        icon: Users,
      },
      {
        title: "Products",
        value: "18",
        change: "+5",
        trend: "up" as const,
        description: "Candidates hired",
        subtitle: "This quarter",
        icon: CheckCircle,
      },
      {
        title: "Pending Products",
        value: "43",
        change: "-2",
        trend: "down" as const,
        description: "Awaiting decision",
        subtitle: "Action required",
        icon: Clock,
      },
      {
        title: "Pending Jobs",
        value: "43",
        change: "-2",
        trend: "down" as const,
        description: "Awaiting decision",
        subtitle: "Action required",
        icon: Clock,
      },
      {
        title: "Pending Sponsors",
        value: "43",
        change: "-2",
        trend: "down" as const,
        description: "Awaiting decision",
        subtitle: "Action required",
        icon: Clock,
      },
           {
        title: "Sellers",
        value: "43",
        change: "-2",
        trend: "down" as const,
        description: "Awaiting decision",
        subtitle: "Action required",
        icon: Clock,
      },
               {
        title: "Employers",
        value: "43",
        change: "-2",
        trend: "down" as const,
        description: "Awaiting decision",
        subtitle: "Action required",
        icon: Clock,
      },
    ],
    [],
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
                  Super admin Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" className="cursor-pointer">
              <Link href="/">Home</Link>
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
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("light")}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("system")}
                >
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
              Manage your website listings and review applications.
            </span>
          </h1>

          {/* Stats Grid - Using memoized component */}
          <SuperAdminDashboardStats stats={stats} />


          <ChartAreaInteractive />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
