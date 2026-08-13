'use client';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

import { useAuth } from '@/context/authContext';

function Guard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) redirect('/auth/sign-in');
  }, [user]);
  return <>{children}</>;
}

export default Guard;
