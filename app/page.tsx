'use client';
import { useAuth } from '@/context/authContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ToDashboard() {
  function navigateT(param: boolean) {
    return param ? redirect('/dashboard/overview') : redirect('/auth/sign-in');
  }
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    navigateT(isAuthenticated);
  }, [isAuthenticated]);

  return <></>;
}
