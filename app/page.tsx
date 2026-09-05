'use client';
import { redirect } from 'next/navigation';

import { useAuth } from '@/context/authContext';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  isAuthenticated ? redirect('/dashboard') : redirect('/auth/sign-in');
}
