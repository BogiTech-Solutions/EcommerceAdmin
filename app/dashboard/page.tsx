'use client';
import { redirect } from 'next/navigation';

import { useAuth } from '@/context/authContext';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  isAuthenticated ? redirect('/dashboard/overview') : redirect('/auth/sign-in');
}
