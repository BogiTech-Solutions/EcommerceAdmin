import type { Metadata } from 'next';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <KBar>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          {/* Main Content Area - allows vertical scrolling */}
          <main className="flex-1 overflow-y-auto">
            <Header />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
