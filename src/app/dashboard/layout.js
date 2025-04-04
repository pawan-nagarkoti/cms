"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ToastProvider } from "@/components/toastProvider";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AppSidebar />
      </div>
      {/* Main Content */}
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4">
          {children}
          <ToastProvider />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
