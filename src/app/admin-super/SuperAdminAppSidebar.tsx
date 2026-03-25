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

const data = {
  versions: ["1.0.0"],
  navMain: [
    {
      title: "Super admin Dashboard",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/admin-super",
        },
        {
          title: "Jobs",
          url: "/admin-super/jobs",
        },
        {
          title: "Products",
          url: "/admin-super/products",
        },
        {
          title: "products categories",
          url: "/admin-super/productscategories",
        },
        {
          title: "Job categories",
          url: "/admin-super/jobscategories",
        },
        {
          title: "Users",
          url: "/admin-super/users",
        },
        {
          title: "Sponsors",
          url: "/admin-super/sponsors",
        },
      ],
    },
  ],
};

export function SuperAdminAppSidebar({ ...props }) {
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
