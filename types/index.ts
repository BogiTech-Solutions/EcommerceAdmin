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
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  phone: string;
  status: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}
export interface PaginatedUsersResponse {
  content: User[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  totalElements: number;
  totalPages: number;
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

// types/order.ts
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'refunded' | 'failed';

export interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
}

export interface PaginatedProductResponse {
  content: Product[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  categoryId: number;
}
