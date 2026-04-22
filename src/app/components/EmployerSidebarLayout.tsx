"use client";

import { EmployerAppSidebar } from "@/employer/EmployerAppSidebar";
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
import { useTheme } from "@/context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { type Language, useI18n } from "@/context/I18nContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { authApi, useLogoutMutation } from "@/Redux/Services/AuthApi";
import { useAppDispatch } from "@/Redux/hooks";
import { logout as logoutAction } from "@/Redux/slices/AuthSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const employerLayoutCopy: Record<Language, Record<string, string>> = {
  en: {
    dashboard: "Employer Dashboard",
    home: "Home",
    logout: "Logout",
    toggleTheme: "Toggle theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  fr: {
    dashboard: "Tableau employeur",
    home: "Accueil",
    logout: "Se deconnecter",
    toggleTheme: "Changer le theme",
    light: "Clair",
    dark: "Sombre",
    system: "Systeme",
  },
  ar: {
    dashboard: "لوحة صاحب العمل",
    home: "الرئيسية",
    logout: "تسجيل الخروج",
    toggleTheme: "تبديل المظهر",
    light: "فاتح",
    dark: "داكن",
    system: "النظام",
  },
};

export default function EmployerSidebarLayout({
  children,
  breadcrumbTitle = "Dashboard",
}: {
  children: React.ReactNode;
  breadcrumbTitle?: string;
}) {
  const { setTheme } = useTheme();
  const { language } = useI18n();
  const copy = employerLayoutCopy[language];
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      toast.success(copy.logout);
    } catch {
      toast.error("Logout failed");
    } finally {
      dispatch(logoutAction());
      dispatch(authApi.util.resetApiState());
      router.replace("/login");
      router.refresh();
    }
  };

  return (
    <SidebarProvider>
      <EmployerAppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/employer">
                  {copy.dashboard}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher compact />
            <Button variant="primary" className="cursor-pointer" >
              <Link href="/">{copy.home}</Link>
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              {copy.logout}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">{copy.toggleTheme}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-zinc-900 shadow-lg border border-border rounded-md"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  {copy.light}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  {copy.dark}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  {copy.system}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
