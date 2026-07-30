// components/Sidebar.tsx
import { Home, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className='h-screen w-64 bg-gray-800 p-4 text-white'>
      <h2 className='mb-6 text-xl font-bold'>Shadcn Admin</h2>
      <nav>
        <ul className='space-y-2'>
          <li>
            <Link
              href='/dashboard'
              className='flex items-center gap-2 rounded p-2 hover:bg-gray-700'
            >
              <Home className='h-5 w-5' /> Dashboard
            </Link>
          </li>
          <li>
            <Link
              href='/customers'
              className='flex items-center gap-2 rounded p-2 hover:bg-gray-700'
            >
              <Users className='h-5 w-5' /> Customers
            </Link>
          </li>
          <li>
            <Link
              href='/settings'
              className='flex items-center gap-2 rounded p-2 hover:bg-gray-700'
            >
              <Settings className='h-5 w-5' /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
