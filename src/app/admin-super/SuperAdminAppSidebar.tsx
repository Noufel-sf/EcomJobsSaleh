"use client";

import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { type Language, useI18n } from "@/context/I18nContext";

const superAdminSidebarCopy: Record<Language, Record<string, string>> = {
  en: {
    title: "Super Admin Dashboard",
    overview: "Overview",
    jobs: "Jobs",
    products: "Products",
    productsCategories: "Products Categories",
    jobsCategories: "Job Categories",
    sellers: "Sellers",
    employers: "Employers",
    sponsors: "Sponsors",
  },
  fr: {
    title: "Tableau super admin",
    overview: "Vue d'ensemble",
    jobs: "Emplois",
    products: "Produits",
    productsCategories: "Categories produits",
    jobsCategories: "Categories emplois",
    employers :"Employers" ,
    sellers :"Sellers" , 
    users: "Utilisateurs",
    sponsors: "Sponsors",
  },
  ar: {
    title: "لوحة السوبر ادمن",
    overview: "نظرة عامة",
    jobs: "الوظائف",
    products: "المنتجات",
    productsCategories: "فئات المنتجات",
    jobsCategories: "فئات الوظائف",
    employers: "أصحاب العمل",
    sellers: "البائعين",
    users: "المستخدمون",
    sponsors: "الرعاة",
  },
};

export function SuperAdminAppSidebar({ ...props }) {
  const { language } = useI18n();
  const copy = superAdminSidebarCopy[language];

  const data = {
    versions: ["1.0.0"],
    navMain: [
      {
        title: copy.title,
        url: "#",
        items: [
          {
            title: copy.overview,
            url: "/admin-super",
          },
          {
            title: copy.jobs,
            url: "/admin-super/jobs",
          },
          {
            title: copy.products,
            url: "/admin-super/products",
          },
          {
            title: copy.productsCategories,
            url: "/admin-super/productscategories",
          },
          {
            title: copy.jobsCategories,
            url: "/admin-super/jobscategories",
          },
          {
            title: copy.employers,
            url: "/admin-super/employers",
          },
          {
            title: copy.sellers,
            url: "/admin-super/sellers",
          },
          {
            title: copy.sponsors,
            url: "/admin-super/sponsors",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar className="" {...props}>
      <SidebarHeader className="">
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>
      <SidebarContent className={""}>
        {data.navMain.map((item) => (
          <SidebarGroup className={""} key={item.title}>
            <SidebarGroupLabel className={""}> {item.title}</SidebarGroupLabel>
            <SidebarGroupContent className={""}>
              <SidebarMenu className={""}>
                {item.items.map((item) => (
                  <SidebarMenuItem className="" key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail className="" />
    </Sidebar>
  );
}
