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
import { type Language, useI18n } from '@/context/I18nContext';

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
        {
          title: 'Profile',
          url: '/employer/profile',
        },
      ],
    },
  ],
};

const employerSidebarCopy: Record<
  Language,
  {
    groupTitle: string;
    items: {
      overview: string;
      jobs: string;
      applications: string;
      profile: string;
    };
  }
> = {
  en: {
    groupTitle: 'Employer Dashboard',
    items: {
      overview: 'Overview',
      jobs: 'Jobs',
      applications: 'Applications',
      profile: 'Profile',
    },
  },
  fr: {
    groupTitle: 'Tableau employeur',
    items: {
      overview: "Vue d'ensemble",
      jobs: 'Offres',
      applications: 'Candidatures',
      profile: 'Profil',
    },
  },
  ar: {
    groupTitle: 'لوحة صاحب العمل',
    items: {
      overview: 'نظرة عامة',
      jobs: 'الوظائف',
      applications: 'طلبات التوظيف',
      profile: 'الملف الشخصي',
    },
  },
};

export function EmployerAppSidebar({ ...props }) {
  const { language } = useI18n();
  const copy = employerSidebarCopy[language];

  const localizedData = {
    ...data,
    navMain: [
      {
        ...data.navMain[0],
        title: copy.groupTitle,
        items: [
          { ...data.navMain[0].items[0], title: copy.items.overview },
          { ...data.navMain[0].items[1], title: copy.items.jobs },
          { ...data.navMain[0].items[2], title: copy.items.applications },
          { ...data.navMain[0].items[3], title: copy.items.profile },
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
        {localizedData.navMain.map((item) => (
          <SidebarGroup className={""} key={item.title}>
            <SidebarGroupLabel className={""}> {item.title}</SidebarGroupLabel>
            <SidebarGroupContent className={""}>
              <SidebarMenu className={""}>
                {item.items.map((item) => (
                  <SidebarMenuItem className="" key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className="cursor-pointer">
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