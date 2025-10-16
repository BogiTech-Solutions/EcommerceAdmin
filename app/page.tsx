// app/dashboard/page.tsx
import Header from "@/components/header";
import MetricCard from "@/components/metric-card";
import Sidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/theme-toggler";
import { Users, DollarSign, ShoppingCart } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModeToggle />
            <MetricCard title="Total Users" value="1,234" icon={<Users className="h-5 w-5 text-gray-500" />} />
            <MetricCard title="Revenue" value="$12,345" icon={<DollarSign className="h-5 w-5 text-gray-500" />} />
            <MetricCard title="Orders" value="567" icon={<ShoppingCart className="h-5 w-5 text-gray-500" />} />
          </div>
        </main>
      </div>
    </div>
  );
}