'use client';

import {
  IconBell,
  IconCategory,
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconDashboard,
  IconLayoutKanban,
  IconLogout,
  IconPackage,
  IconPhotoUp,
  IconSettings,
  IconSpeakerphone,
  IconUser,
  IconUserCircle
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

// UI Components
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useAuth } from '@/context/authContext';

import { OrgSwitcher } from '../org-switcher';

// Nav item interface
export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavItem {
  title: string;
  url: string;
  icon: string;
  isActive?: boolean;
  shortcut?: string[];
  items?: NavSubItem[];
}

// Navigation items config
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Categories',
    url: '/dashboard/categories',
    icon: 'category',
    shortcut: ['c', 'c'],
    isActive: false,
    items: []
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: 'products',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'user',
    shortcut: ['u', 'u'],
    isActive: false,
    items: []
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: 'kanban',
    shortcut: ['o', 'o'],
    isActive: false,
    items: []
  },
  {
    title: 'Ads',
    url: '/dashboard/ads',
    icon: 'ads',
    shortcut: ['a', 'a'],
    isActive: false,
    items: []
  },
  {
    title: 'Profile',
    url: '/dashboard/profile',
    icon: 'profile',
    shortcut: ['p', 'r'],
    isActive: false,
    items: []
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: 'settings',
    shortcut: ['s', 's'],
    isActive: false,
    items: []
  }
];

export const company = {
  name: 'Acme Inc',
  logo: IconPhotoUp,
  plan: 'Enterprise'
};

const tenants = [
  { id: '1', name: 'Acme Inc' },
  { id: '2', name: 'Beta Corp' },
  { id: '3', name: 'Gamma Ltd' }
];

// Map string keys to Tabler React Components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: IconDashboard,
  category: IconCategory,
  products: IconPackage,
  user: IconUser,
  kanban: IconLayoutKanban,
  ads: IconSpeakerphone,
  profile: IconUserCircle,
  settings: IconSettings
};

export default function AppSidebar() {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Safeguard client-side redirect
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/sign-in');
    }
  }, [isAuthenticated, router]);

  const handleSwitchTenant = (_tenantId: string) => {
    // Tenant switching logic
  };

  const activeTenant = tenants[0];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher
          tenants={tenants}
          defaultTenant={activeTenant}
          onTenantSwitch={handleSwitchTenant}
        />
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {/* Main Navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const ItemIcon = iconMap[item.icon] || IconPackage;
              const hasChildren = Boolean(item.items && item.items.length > 0);
              const isParentActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive || isParentActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} isActive={isParentActive}>
                          <ItemIcon />
                          <span>{item.title}</span>
                          <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <ItemIcon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {user && (
                    <UserAvatarProfile className="h-8 w-8 rounded-lg" showInfo user={user} />
                  )}
                  <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    {user && (
                      <UserAvatarProfile className="h-8 w-8 rounded-lg" showInfo user={user} />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <IconSettings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
                    <IconCreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/notifications')}>
                    <IconBell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <IconLogout className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
