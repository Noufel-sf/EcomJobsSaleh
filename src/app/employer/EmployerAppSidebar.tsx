import { VersionSwitcher } from '@/components/version-switcher';
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
} from '@/components/ui/sidebar';
import Link from 'next/link';

const data = {
  versions: ['1.0.0'],
  navMain: [
    {
      title: 'Employer Dashboard',
      url: '#',
      items: [
        {
          title: 'Overview',
          url: '/employer',
        },
        {
          title: 'Jobs',
          url: '/employer/jobs',
        },
        {
          title: 'Applications',
          url: '/employer/applications',
        },
      ],
    },
  ],
};

export function EmployerAppSidebar({ ...props }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
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
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="cursor-pointer">
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}