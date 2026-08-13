import Guard from '@/components/guard';
import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <KBar>
      <Guard>
        <SidebarProvider defaultOpen={true}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="h-full max-h-screen flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Guard>
    </KBar>
  );
}
