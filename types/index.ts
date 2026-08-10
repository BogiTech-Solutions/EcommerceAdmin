import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}
export interface User {
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

// types/category.ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  parentName?: string;
  productCount: number;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parentId?: string;
  description?: string;
  status: 'active' | 'archived';
}

// types/user.ts
export type UserRole = 'Admin' | 'Customer' | 'Vendor';
export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// types/ad.ts
export type AdPlacement = 'homepage_hero' | 'sidebar' | 'popup' | 'footer';
export type AdStatus = 'active' | 'scheduled' | 'paused' | 'expired';

export interface Advertisement {
  id: string;
  title: string;
  placement: AdPlacement;
  imageUrl: string;
  targetUrl: string;
  status: AdStatus;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  ctr: number; // Click Through Rate percentage
  createdAt: string;
}

export interface AdFormData {
  title: string;
  placement: AdPlacement;
  imageUrl: string;
  targetUrl: string;
  status: AdStatus;
  startDate: string;
  endDate: string;
}
