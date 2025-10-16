import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
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
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  },
     {
    title: 'Packages',
    url: '/dashboard/packages',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
     {
    title: 'Spares',
    url: '/dashboard/spares',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
        items: [
      {
        title: 'Availability',
        url: '/dashboard/availability',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Conditions',
        shortcut: ['l', 'l'],
        url: '/conditions',
        icon: 'login'
      },
      {
        title: 'Parts',
        shortcut: ['l', 'l'],
        url: '/parts',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Payments',
    url: '/dashboard/payments',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
    {
    title: 'Manufacturer',
    url: '/dashboard/manufacturer',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
   {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
   {
    title: 'Delivery',
    url: '/dashboard/delivery',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
{
    title: 'Ads',
    url: '/dashboard/ads',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
    {
    title: 'UAC',
    url: '/dashboard/uac',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
        items: [
      {
        title: 'Permissions',
        url: '/dashboard/permissions',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Roles',
        shortcut: ['l', 'l'],
        url: '/roles',
        icon: 'login'
      },
      {
        title: 'Users',
        shortcut: ['l', 'l'],
        url: '/users',
        icon: 'login'
      }
    ]
  },
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
