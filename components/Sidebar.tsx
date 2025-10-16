// components/Sidebar.tsx
import { Home, Users, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Shadcn Admin</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
              <Home className="h-5 w-5" /> Dashboard
            </Link>
          </li>
          <li>
            <Link href="/customers" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
              <Users className="h-5 w-5" /> Customers
            </Link>
          </li>
          <li>
            <Link href="/settings" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
              <Settings className="h-5 w-5" /> Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}