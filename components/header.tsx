import { redirect } from 'next/navigation';

import { useAuth } from '@/context/authContext';

// components/Header.tsx
export default function Header() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    console.log('Non Authenticated');
    redirect('/auth/sign-in');
  }
  console.log('USER', isAuthenticated);
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">User Name</span>
        <button className="rounded-full bg-gray-200 p-2">Logout</button>
      </div>
    </header>
  );
}
