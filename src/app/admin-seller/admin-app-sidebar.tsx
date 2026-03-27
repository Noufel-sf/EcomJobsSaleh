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

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Admin Dashboard',
      url: '#',
      items: [
        // {
        //   title: 'Users',
        //   url: '/admin/users',
        // },
      
        {
          title: 'Products',
          url: '/admin-seller/products',
        },
        {
          title: 'Orders',
          url: '/admin-seller/orders',
        },
        {
          title: 'Shipping',
          url: '/admin-seller/shipping',
        },
        {
          title: 'store settings',
          url: '/admin-seller/store',
        },
      ],
    },
  ],
};

const adminSidebarCopy: Record<
  Language,
  {
    groupTitle: string;
    items: {
      products: string;
      orders: string;
      shipping: string;
      store: string;
    };
  }
> = {
  en: {
    groupTitle: 'Admin Dashboard',
    items: {
      products: 'Products',
      orders: 'Orders',
      shipping: 'Shipping',
      store: 'Store settings',
    },
  },
  fr: {
    groupTitle: 'Tableau de bord admin',
    items: {
      products: 'Produits',
      orders: 'Commandes',
      shipping: 'Livraison',
      store: 'Parametres boutique',
    },
  },
  ar: {
    groupTitle: 'لوحة تحكم البائع',
    items: {
      products: 'المنتجات',
      orders: 'الطلبات',
      shipping: 'الشحن',
      store: 'اعدادات المتجر',
    },
  },
};

export function AdminAppSidebar({ ...props }) {
  const { language } = useI18n();
  const copy = adminSidebarCopy[language];

  const localizedData = {
    ...data,
    navMain: [
      {
        ...data.navMain[0],
        title: copy.groupTitle,
        items: [
          { ...data.navMain[0].items[0], title: copy.items.products },
          { ...data.navMain[0].items[1], title: copy.items.orders },
          { ...data.navMain[0].items[2], title: copy.items.shipping },
          { ...data.navMain[0].items[3], title: copy.items.store },
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
      <SidebarContent className="">
        {/* We create a SidebarGroup for each parent. */}
        {localizedData.navMain.map((item) => (
          <SidebarGroup className="" key={item.title}>
            <SidebarGroupLabel className="">{item.title}</SidebarGroupLabel>
            <SidebarGroupContent className="">
              <SidebarMenu className="">
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
